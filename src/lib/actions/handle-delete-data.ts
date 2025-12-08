// app/actions/delete-address.ts
"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export async function actiondDeleteAddress(address_ID: number, title: string) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) {
      redirect("/login");
    }

    // get user payload
    const payload = await UserPayload();
    if (!payload) redirect("/login");
    
    const user_ID = Number(payload.user_ID);
    const addressType = title?.toLowerCase().includes("billing") ? "billing" : "shipping";

    // find address and verify ownership
    const address = await prisma.address.findUnique({
      where: { address_ID: address_ID },
    });

    if (!address || address.user_ID !== user_ID) {
      return {
        success: false,
        message: "Unauthorized delete attempt.",
        status: 403
      };
    }

    // Check if address is used in active orders (optional - uncomment if needed)
    /*
    const activeOrder = await prisma.order_purchased.findFirst({
      where: {
        OR: [
          { delivery_address_ID: address_ID },
          { billing_address_ID: address_ID },
        ],
        AND: [
          {
            OR: [
              { order_purchased_status: { not: "delivered" } },
              { order_purchased_tracking_number: "pending" },
            ],
          },
        ],
      },
    });

    if (activeOrder) {
      return {
        success: false,
        message: "You cannot delete this address because it is used in an order that is not yet delivered.",
        status: 400
      };
    }
    */

    // 6. Proceed with deletion
    await prisma.address.delete({ 
      where: { address_ID: address_ID } 
    });

    updateTag(addressType);
    updateTag("order-history");
    updateTag("get-address-and-billing");

    return {
      successMessage: "Deleted Successfully.",
      status: 200
    };
  } catch (err: unknown) {
    // console.error("Delete address error:", err);

    // Handle specific Prisma errors
    const errorMessage = err instanceof Prisma.PrismaClientKnownRequestError
      ? "You cannot delete this address because it is used in an order."
      : err instanceof Error
      ? err.message
      : "Failed to delete address.";

    return {
      errorMessage: errorMessage,
      status: 400
    };
  }
}