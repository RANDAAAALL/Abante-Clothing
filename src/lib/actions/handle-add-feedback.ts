"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { redirect } from "next/navigation";

export type FeedbackItem = {
  order_detail_ID: number;
  feedback: string;
  rating: number;
};

export type SubmitFeedbackData = {
  orderData: FeedbackItem[];
};

export async function actionSubmitFeedback(orderData: FeedbackItem[]) {
  try {
    // get user payload and check authentication
    const payload = await UserPayload();
    const userType = payload?.user_role;

    if (!(await isAuthenticatedUser())) redirect(userType === "admin" ? "/admin/login" : "/login");
    if (!payload) redirect(userType === "admin" ? "/admin/login" : "/login");

    // validate input
    if (!orderData || orderData.length <= 0) {
      return {
        errorMessage: "No feedback data provided",
        status: 400,
      };
    }

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
    // revalidate cache
    updateTag("order-history");

    return {
      successMessage: "Feedback submitted successfully.",
      status: 200,
    };
  } catch (err: unknown) {
    // console.error("Submit feedback error:", err);

    // handle specific errors
    let errorMessage = "Failed to submit feedback";
    let status = 500;

    if (err instanceof Error) {
      if (
        err.message.includes("foreign key constraint") ||
        err.message.includes("Order detail not found")
      ) {
        errorMessage = "Invalid order data";
        status = 400;
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
