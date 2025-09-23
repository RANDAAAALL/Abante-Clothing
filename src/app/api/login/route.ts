import { loginSchema } from "@/lib/validations/auth-schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const bodyData = await req.json();
    
    // validate the incoming data
    const parseData = loginSchema.safeParse(bodyData);

    // if validation fails, return a 400 response with error details
    if (!parseData.success) {
      return NextResponse.json(
        { errorMessage: "Invalid data", parsedErrors: parseData.error.flatten().fieldErrors },
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
        username: true,
        email: true,
        password: true,
      }
    })

    // if user not found, return a 404 response
    if(!usersDetails){
      return NextResponse.json(
        {errorMessage: "User not found"},
        {status: 404}
      )
    }

    // check if the password matches
    if(usersDetails.password !== parseData.data.password){
      return NextResponse.json(
        {errorMessage: "Invalid password"},
        {status: 401}
      )
    }

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