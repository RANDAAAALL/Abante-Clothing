import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { revalidateTag } from "next/cache";

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
  if (!verifyCsrfToken(request)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 });

  const payload = await UserPayload();
  const userID = Number(payload?.user_ID);
  if (!userID) return NextResponse.redirect("/login");

  try {
    // Check if user has any orders
    const orders = await prisma.order_purchased.findMany({
      where: { user_ID: userID }
    });

    // Check for pending orders
    const hasPendingOrders = orders.some(
      order => order.order_purchased_status !== "delivered" && order.order_purchased_tracking_number === "pending"
    );
    
    if (hasPendingOrders) {
      return NextResponse.json(
        { errorMessage: "You can't delete your account. You have order(s) that are not yet delivered." },
        { status: 400 }
      );
    }

    // Check for pending returns
    for (const order of orders) {
      const orderDetails = await prisma.order_details.findMany({
        where: { order_purchased_ID: order.order_purchased_ID }
      });

      for (const detail of orderDetails) {
        const pendingReturn = await prisma.returns.findFirst({
          where: {
            order_detail_ID: detail.order_detail_ID,
            is_return_accepted: null
          }
        });
        
        if (pendingReturn) {
          return NextResponse.json(
            { errorMessage: "You can't delete your account, you still have pending return item(s)." },
            { status: 400 }
          );
        }
      }
    }

    // If user has no orders, delete everything including user
    // If user has orders, just nullify user data but keep the user record
    if (orders.length === 0) {
      // New user - delete everything
      await prisma.$transaction([
        prisma.cart_items.deleteMany({ where: { user_ID: userID } }),
        prisma.address.deleteMany({ where: { user_ID: userID } }),
        prisma.users.delete({ where: { user_ID: userID } })
      ]);
    } else {
      // User with orders - keep user record but clear data
      await prisma.$transaction([
        prisma.cart_items.deleteMany({ where: { user_ID: userID } }),
        prisma.users.update({
          where: { user_ID: userID },
          data: {
            email: null,
            password: null,
            role: null,
          }
        })
      ]);
    }

    // Clear cookies
    const response = NextResponse.json({ successMessage: "Account Deleted Successfully" }, { status: 200 });
    
    const cookieSettings = {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 0,
    };

    response.cookies.set("session_token", "", cookieSettings);
    response.cookies.set("refresh_token", "", cookieSettings);
    response.cookies.set("csrf_token", "", cookieSettings);

    // Clear cache
    revalidateTag("shipping");
    revalidateTag("billing");
    revalidateTag("access-details");
    revalidateTag("order-history");

    return response;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "You cannot delete your account at the moment.";
    return NextResponse.json({ errorMessage }, { status: 500 });
  }
}