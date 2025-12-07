// app/api/update-return-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";

export async function PATCH(request: NextRequest) {
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


  try {
    const body = await request.json();
    const { return_ID, is_return_accepted } = body;

    if (!return_ID) {
      return NextResponse.json(
        { errorMessage: "Missing return_ID" },
        { status: 400 }
      );
    }

    if (!is_return_accepted || !["Accepted", "Rejected"].includes(is_return_accepted)) {
      return NextResponse.json(
        { errorMessage: "Invalid status. Must be 'Accepted' or 'Rejected'" },
        { status: 400 }
      );
    }

    // Update the return status in the returns table
    const updatedReturn = await prisma.returns.update({
      where: { return_ID },
      data: { 
        is_return_accepted,
        returned_date: new Date(),
      },
      include: {
        order_details: {
          include: {
            order_purchased: {
              include: {
                order_details: {
                  include: {
                    returns: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Check if all items in the order are returned & accepted
    const order = updatedReturn.order_details?.order_purchased;
    
    if (order) {
      const allOrderDetails = order.order_details;
      
      // Check if all order details have at least one accepted return
      const allItemsReturnedAndAccepted = allOrderDetails.every(detail => {
        // If the detail has returns, check if any are accepted
        if (detail.returns && detail.returns.length > 0) {
          return detail.returns.some(returnItem => returnItem.is_return_accepted === "Accepted");
        }
        // If no returns, then this item is not returned
        return false;
      });

      // If all items are returned and accepted, update order status to "returned"
      if (allItemsReturnedAndAccepted) {
        await prisma.order_purchased.update({
          where: { order_purchased_ID: order.order_purchased_ID },
          data: { order_purchased_status: "returned" },
        });
      }
    }

    // Revalidate to get fresh data
    revalidateTag("orders", {});
    revalidateTag("order-history", {});

    // Respond with success
    return NextResponse.json({
      successMessage: `Return ${is_return_accepted.toLowerCase()} successfully.`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { errorMessage: err instanceof Error ? err.message : `Failed to update return status.` },
      { status: 500 }
    );
  }
}