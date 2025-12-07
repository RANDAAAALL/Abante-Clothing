import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function PATCH(request: NextRequest){
     //  check if admin is logged in
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
  if (!verifyCsrfToken(request))
    return NextResponse.json(
      { errorMessage: "Invalid CSRF Token" },
      { status: 403 }
    );

  try{
    const { order_purchased_number, order_purchased_status, order_purchased_tracking_number } =
    await request.json();

    await prisma.order_purchased.update({
        where: { order_purchased_number: order_purchased_number },
        data: {
        order_purchased_status,
        order_purchased_tracking_number,
        },
    });

    // revalidate cache on the admin side
    revalidateTag("orders", {});

    // revalidate cache on the customer side
    revalidateTag("order-history", {});

    return NextResponse.json(
        { successMessage: "Updated successfully" },
        { status: 200 }
      );
  }catch(err: unknown){
    return NextResponse.json(
        { errorMessage: err instanceof Error ? err.message : "Failed to edit orders status or tracking number." },
        { status: 500 }
    )
  }
}