import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { EditAccountDetailsSchema } from "@/lib/validations/edit-account-detail-schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function PUT(request: NextRequest) {
  // Check if user is logged in
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
  if (!verifyCsrfToken(request))
    return NextResponse.json(
      { errorMessage: "Invalid CSRF Token" },
      { status: 403 }
    );

  const payload = await UserPayload();
  if (!payload) return NextResponse.redirect("/login");
  
  const user_ID = Number(payload.user_ID);
  if (!user_ID) return NextResponse.redirect("/login");
   
  try {
    const editFormdata = await request.json();
    const parsedEditFormData = EditAccountDetailsSchema.safeParse(editFormdata);
    
    if (!parsedEditFormData.success) {
      return NextResponse.json(
        { errorMessage: "Invalid form data",
          parsedErrors: parsedEditFormData.error.flatten().fieldErrors},
        { status: 400 }
      );
    }

    const { email, username } = parsedEditFormData.data;

    // Check if the email already exists and cxclude the current user
    const existingEmail = await prisma.users.findFirst({
      where: { 
        email: email,
        user_ID: { not: user_ID } 
      }
    });

    if (existingEmail) {
      return NextResponse.json(
        { errorMessage: "Email already exists. Please try another email" },
        { status: 409 }
      );
    }

    // check if the username already exists and cxclude the current user
    const existingUsername = await prisma.users.findFirst({
      where: { 
        username: username,
        user_ID: { not: user_ID } 
      }
    });

    if (existingUsername) {
      return NextResponse.json(
        { errorMessage: "Username already exists. Please try another username" },
        { status: 409 }
      );
    }

    // update the users account details
    await prisma.users.update({
      where: { user_ID: user_ID },
      data: {
        email: email,
        username: username,
      }
    });

    // revalidate cache
    revalidateTag("account-details");
    revalidateTag("customer-feedbacks");

    return NextResponse.json({ 
      successMessage: "Account details updated successfully." 
    });

  } catch (err: unknown) {
    return NextResponse.json(
      { errorMessage: "Failed to update account details." },
      { status: 500 }
    );
  }
}