"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { redirect } from "next/navigation";

export type UpdateReturnStatusData = {
  return_ID: number;
  is_return_accepted: string;
};

export async function actionUpdateReturnStatus(data: UpdateReturnStatusData) {
  try {
    const { return_ID, is_return_accepted } = data;

    // get user payload and check authentication
    const payload = await UserPayload();
    const userType = payload?.user_role;

    if (!(await isAuthenticatedUser()))
      redirect(userType === "admin" ? "/admin/login" : "/login");
    if (!payload) redirect(userType === "admin" ? "/admin/login" : "/login");

    // validate input
    if (!return_ID) {
      return {
        errorMessage: "Missing return ID",
        status: 400,
      };
    }

    if (
      !is_return_accepted ||
      !["Accepted", "Rejected"].includes(is_return_accepted)
    ) {
      return {
        success: false,
        errorMessage: "Invalid status. Must be 'Accepted' or 'Rejected'",
        status: 400,
      };
    }

    // update the return status in the returns table
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
                    returns: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // check if all items in the order are returned & accepted
    const order = updatedReturn.order_details?.order_purchased;

    if (order) {
      const allOrderDetails = order.order_details;

      // check if all order details have at least one accepted return
      const allItemsReturnedAndAccepted = allOrderDetails.every((detail) => {
        // if the detail has returns, check if any are accepted
        if (detail.returns && detail.returns.length > 0) {
          return detail.returns.some(
            (returnItem) => returnItem.is_return_accepted === "Accepted"
          );
        }
        // if no returns, then this item is not returned
        return false;
      });

      // if all items are returned and accepted, update order status to "returned"
      if (allItemsReturnedAndAccepted) {
        await prisma.order_purchased.update({
          where: { order_purchased_ID: order.order_purchased_ID },
          data: { order_purchased_status: "returned" },
        });
      }
    }

    // revalidate cache
    updateTag("orders");
    updateTag("order-history");

    return {
      successMessage: `Return ${is_return_accepted.toLowerCase()} successfully.`,
      status: 200,
    };
  } catch (err: unknown) {
    // console.error("update return status error:", err);
    return {
      success: false,
      errorMessage:
        err instanceof Error ? err.message : "Failed to update return status.",
      status: 500,
    };
  }
}
