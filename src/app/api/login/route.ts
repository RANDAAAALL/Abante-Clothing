import { loginSchema } from "@/lib/validations/auth-schema";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { GenerateAuthToken } from "@/lib/security/jwt";
import { setAuthCookie } from "@/lib/security/cookies";
import { isValidHashedPassword } from "@/lib/hash/compare-hash-password";
import { revalidatePath } from "next/cache";

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

    // generate auth token
    const authToken = await GenerateAuthToken({
      user_ID: usersDetails.user_ID,
    });    

    // set the token in the cookie
    await setAuthCookie(authToken);

    // revalidatePath("/");

    // return a success response
    return NextResponse.json(
      { successMessage: "Login successfully"},
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Logging in: ", error);
    return NextResponse.json(
      { errorMessage: "Internal Server Error" },
      { status: 500 }
    );
  }
}