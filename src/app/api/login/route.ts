import { loginSchema } from "@/lib/validations/auth-schema";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { generateSessionToken } from "@/lib/security/jwt/generate-session-token";
import { setSessionCookie } from "@/lib/security/cookie/set-session-cookie";
import { isValidHashedPassword } from "@/lib/hash/compare-hash-password";
import { generateCsrfToken } from "@/lib/security/csrf/generate-csrf-token";
import { setCsrfToken } from "@/lib/security/csrf/set-csrf-token";
import { generateRefreshToken } from "@/lib/security/jwt/generate-refresh-token";
import { setRefreshCookie } from "@/lib/security/cookie/set-refresh-cookie";

export async function POST(req: Request) {
  try {
    const bodyData = await req.json();
    
    // validate the incoming data
    const parseData = loginSchema.safeParse(bodyData);

    // if validation fails, return a 400 response with error details
    if (!parseData.success) {
      return NextResponse.json(
        { errorMessage: "Please check your input and try again.", parsedErrors: parseData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // check if the user exists in the database
    const usersDetails = await prisma?.users.findUnique({
      where: {
        email: parseData.data.email,
      },
      select: {
        user_ID: true,
        password: true,
      }
    });

    // if user not found, return a 404 response
    if(!usersDetails){
      return NextResponse.json(
        {errorMessage: "Login failed. Please check your email or password."},
        {status: 404}
      )
    }

      // check if the password isn't matches
      if(!await isValidHashedPassword(parseData.data.password, usersDetails.password ?? "")){
        return NextResponse.json(
          {errorMessage: "Invalid password"},
          {status: 401}
        )
      }

    // generate session token
    const sessionToken = await generateSessionToken({ user_ID: usersDetails.user_ID });    

    // generate refresh token
    const refreshToken = await generateRefreshToken({ user_ID: usersDetails.user_ID });    

    // set session token in cookie
    await setSessionCookie(sessionToken);

    // set refresh token in cookie
    await setRefreshCookie(refreshToken);

    // generate a csrf token
    const csrfToken = generateCsrfToken();

    // set the csrf token in the cookie
    await setCsrfToken(csrfToken);

    // revalidatePath("/");

    // return a success response
    return NextResponse.json(
      { successMessage: "Login successfully"},
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error Logging in: ", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { errorMessage: `Internal Server Error: ${error instanceof Error ? error.message : error}` },
      { status: 500 }
    );
  }
}