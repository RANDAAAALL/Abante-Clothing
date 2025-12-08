"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { redirect } from "next/navigation";

export type UpdateOrderStatusData = {
  order_purchased_number: string;
  order_purchased_status: string;
  order_purchased_tracking_number: string;
};

export async function actionUpdateOrderStatusAndTrackingNumber(data: UpdateOrderStatusData) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) redirect("/login");

    // destructure data
    const {
      order_purchased_number,
      order_purchased_status,
      order_purchased_tracking_number,
    } = data;

    // validate input
    if (!order_purchased_number) {
      return {
        errorMessage: "Order number is required",
        status: 400,
      };
    }

    if (!order_purchased_status) {
      return {
        errorMessage: "Order status is required",
        status: 400,
      };
    }

    // update order in database   
    await prisma.order_purchased.update({
        where: { order_purchased_number: order_purchased_number },
        data: {
        order_purchased_status,
        order_purchased_tracking_number,
        },
    });

    // revalidate cache
    // admin side
    updateTag("orders");

    // customer side
    updateTag("order-history");

    return {
      successMessage: "Order updated successfully",
      status: 200,
    };
  } catch (err: unknown) {
    // console.error("Update order status error:", err);

    // handle specific errors
    let errorMessage = "Failed to update order status";
    let status = 500;

    if (err instanceof Error) {
      if (
        err.message.includes("RecordNotFound") ||
        err.message.includes("does not exist")
      ) {
        errorMessage = "Order not found";
        status = 404;
      } else {
        errorMessage = err.message;
      }
    }

    return {
      errorMessage,
      status,
    };
  }
}
