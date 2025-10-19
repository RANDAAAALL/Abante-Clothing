import { resetPasswordSchema } from "@/lib/validations/auth-schema";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { hashedResetPasswordToken } from "@/lib/hash/hash-reset-password-token";
import { hashPassword } from "@/lib/hash/create-hash-password";
import { isValidHashedPassword } from "@/lib/hash/compare-hash-password";

export async function POST(req: Request){
    const { resetPasswordToken, formData } = await req.json();

    try{
        // parse and validate form data
        const parsedData = resetPasswordSchema.safeParse(formData);

        // check if validation fails
        if (!parsedData.success) {
            return NextResponse.json(
              { errorMessage: "Please check your input and try again.",
                parsedErrors: parsedData.error.flatten().fieldErrors,
              },
              { status: 400 }
            );
          };
          
          // create a hashed token based on query params
          const hashedToken = hashedResetPasswordToken(resetPasswordToken);

          // extract the current record from the database wtih token
          const resetRecord = await prisma.password_resets.findFirst({
            where: { token: hashedToken},
          });
          
          // checks if there is an existing database record with the hashed token
          if(!resetRecord) return NextResponse.json({ errorMessage: "Invalid token. Please request a new password reset.", responseData: resetRecord }, { status: 404 });
          
          // check if the token has expired
          if(resetRecord?.expires_at < new Date()) return NextResponse.json({ errorMessage: "Token has expired. Please request a new password reset.", responseData: resetRecord}, { status: 400 });

          // extract the old hashed password for checking pursoses
          const user = await prisma.users.findUnique({
            where: { email: resetRecord?.email},
            select: { password: true }
          });

          // check if user exists
          if(!user) return NextResponse.json({ errorMessage: "User not found."}, { status: 404 });

          // check if the new password is the same as the old password
          if(await isValidHashedPassword(parsedData.data.password, user.password ?? "")){
            return NextResponse.json({ errorMessage: "New password cannot be the same as the old password."}, { status: 400 });
          }
          
          // create a hashed new password
          const hashedPassword = await hashPassword(parsedData.data.password);

          // update the user's password
          await prisma.users.update({ where: { email: resetRecord.email }, data: { password: hashedPassword }});

          // deleted the used reset token
          await prisma.password_resets.deleteMany({ where: { id: resetRecord.id }});

        // return success response
        return NextResponse.json({ successMessage: "Reset password successfull"}, { status: 200 });
    }catch(err: unknown){
        return NextResponse.json(
        { errorMessage: err instanceof Error ? err.message : "Internal Server Error"},
        { status: 500 }
      );
    }
}