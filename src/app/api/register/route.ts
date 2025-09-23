import { registerationSchema } from "@/lib/validations/auth-schema";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export async function POST(req: Request) {
  try {
    const bodyData = await req.json();

    // validate the incoming data
    const parseData = registerationSchema.safeParse(bodyData);

    // if validation fails, return a 400 response with error details
    if (!parseData.success) {
      return NextResponse.json(
        { errorMessage: "Invalid data", parsedErrors: parseData.error.flatten().fieldErrors },
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
        { errorMessage: "Email already exists"},
        { status: 409 }
      );
    }

    // create a new user in the database
    await prisma?.users.create({
      data: {
        username: parseData.data.username,
        email: parseData.data.email,
        password: parseData.data.password,
        role: "user",
      }
    })

    // return a success response
    return NextResponse.json(
      { successMessage: "User registered successfully"},
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { errorMessage: "Internal Server Error" },
      { status: 500 }
    );
  }
};