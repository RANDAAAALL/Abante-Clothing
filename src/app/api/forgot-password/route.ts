import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth-schema";
import { generateForgotPasswordEmail } from "@/lib/helper/generate-forgot-password-email";
import { ResetPasswordURL } from "@/lib/config";
import prisma from "@/lib/prisma/prisma";
import { generateResetPasswordToken } from "@/lib/hash/generate-reset-password-token";
import { hashedResetPasswordToken } from "@/lib/hash/hash-reset-password-token";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsedData = forgotPasswordSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          errorMessage: "Please check your input and try again.",
          parsedErrors: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    };;

    // check if the email exists in the database
    const isExists = await prisma.users.findUnique({where: { email: parsedData.data.email }});
    if(!isExists) return NextResponse.json({ errorMessage: "Email doesn't exists"}, { status: 404 });

    // generate reset password token
    const resetPasswordToken = generateResetPasswordToken(); 
    
    // create a hashed token based on generate reset password token
    const hashedToken = hashedResetPasswordToken(resetPasswordToken);

    // store the hashed token in the database
    await prisma.password_resets.create({
        data: {
            email: parsedData.data.email,
            token: hashedToken,
            expires_at: new Date(Date.now() + 1000 * 60 * 15) // expires in 15mins
        }
    })

    // create reset link
    const resetLink = `${ResetPasswordURL}?token=${resetPasswordToken}`;

    // send reset email using brevo api
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Abante Clothing",
          email: "lesterandig17@gmail.com", 
        },
        to: [{ email: parsedData.data.email }],
        subject: "Reset Your Password",
        htmlContent: generateForgotPasswordEmail(parsedData.data.email, resetLink),
      }),
    });

    // parse response
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { errorMessage: data?.message || "Failed to send reset email. Please try again later." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { successMessage: `Email sent successfully to ${parsedData.data.email}`},
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { errorMessage: err instanceof Error ? err.message : "Internal Server Error"},
      { status: 500 }
    );
  }
}
