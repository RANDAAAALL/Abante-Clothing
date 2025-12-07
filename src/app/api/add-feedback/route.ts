import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest){
    const payload = await UserPayload();
    const userType = payload.user_role;

    // check if user is logged in
  if (!(await isAuthenticatedUser())) return NextResponse.redirect(`${userType === "admin" ? "/admin/login" : "/login"}`);
  if (!verifyCsrfToken(request))
    return NextResponse.json(
      { errorMessage: "Invalid CSRF Token" },
      { status: 403 }
    );

  if (!payload) return NextResponse.redirect(`${userType === "admin" ? "/admin/login" : "/login"}`);

  try{
    const { orderData } = await request.json();
    // console.log("Server -> ", orderData)

    if( orderData.length <= 0) return NextResponse.json({ errorMessage: "Failed to submit feedback." }, { status: 400 });

    for (const item of orderData) {
        await prisma.users_feedback.create({
          data: {
            user_ID: Number(payload.user_ID),
            order_detail_ID: Number(item?.order_detail_ID),
            feedback_comment: item?.feedback?.trim() === "" ? "No additional comments provided." : item?.feedback,
            feedback_rating: Number(item?.rating),
          },
        });
      }       

    // revalidate cache on the customer side
    revalidateTag("order-history", {});

    return NextResponse.json({ successMessage: "Feedback added successfully." }, { status: 200 })
  }catch(err: unknown){
    return NextResponse.json({ errorMessage: err instanceof Error ? err.message : "Failed to submit feedback."}, { status: 500 });
  }
}