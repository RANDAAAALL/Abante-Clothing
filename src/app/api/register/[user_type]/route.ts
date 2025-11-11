import { registerationSchema } from "@/lib/validations/auth-schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { hashPassword } from "@/lib/hash/create-hash-password";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user_type: string }> }) {
  try {
    const bodyData = await req.json();
    const userType = (await params).user_type;

    // validate the incoming data
    const parseData = registerationSchema.safeParse(bodyData);

    // if validation fails, return a 400 response with error details
    if (!parseData.success) {
      return NextResponse.json(
        { errorMessage: "Please check your input and try again.", parsedErrors: parseData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // check if the users email already exists in the database
    const userEmailExists = await prisma.users.findUnique({
      where: { email: parseData.data.email }
    });

    // if email exists, return a 409 response
    if(userEmailExists){
      return NextResponse.json(
        { errorMessage: "Email already exists. Please try another email"},
        { status: 409 }
      );
    };

     // check if the users username already exists in the database
     const userUsernameExists = await prisma.users.findUnique({
      where: { email: parseData.data.username }
    });

     // if username exists, return a 409 response
     if(userUsernameExists){
      return NextResponse.json(
        { errorMessage: "Username already exists. Please try another username"},
        { status: 409 }
      );
    };

    // convert to a hash password
    const hashedPassword = await hashPassword(parseData.data.password);

    // create a new user in the database
    await prisma?.users.create({
      data: {
        username: parseData.data.username,
        email: parseData.data.email,
        password: hashedPassword,
        role: userType,
      }
    })

    // return a success response
    return NextResponse.json(
      { successMessage: "Registered successfully"},
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { errorMessage: error instanceof Error ? error.message :  "Something went wrong during register" },
      { status: 500 }
    );
  }
};