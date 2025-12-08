// app/actions/submit-return-request.ts
"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { redirect } from "next/navigation";

export type ReturnItemProps = {
  order_detail_ID: number | string;
  returned_product_name: string;
  returned_product_qty: number;
  returned_product_size: string;
  returned_product_color: string;
  returned_product_price: number;
  returned_product_image: string | string[];
  returned_product_reason: string;
};

export async function actionSubmitReturnRequest(returnData: ReturnItemProps[]) {
  try {
    // get user payload and check authentication
    const payload = await UserPayload();
    const userType = payload?.user_role;

    if (!(await isAuthenticatedUser()))
      redirect(userType === "admin" ? "/admin/login" : "/login");
    if (!payload) redirect(userType === "admin" ? "/admin/login" : "/login");

    // validate input
    if (!returnData || returnData.length <= 0) {
      return {
        errorMessage: "No return data provided",
        status: 400,
      };
    }

    // Prepare all return records in one go
    const returnRecords = returnData.map((item) => {
      // Handle the image field properly for both single and multiple images
      let productImages: string[];

      if (Array.isArray(item?.returned_product_image)) {
        // If it's already an array, use it directly
        productImages = item.returned_product_image;
      } else if (typeof item?.returned_product_image === "string") {
        // If it's a string, check if it's JSON array or a single URL
        try {
          const parsed = JSON.parse(item.returned_product_image);
          productImages = Array.isArray(parsed)
            ? parsed
            : [item.returned_product_image];
        } catch {
          // If parsing fails, it's a single URL string
          productImages = [item.returned_product_image];
        }
      } else {
        // Fallback to empty array
        productImages = [];
      }

      return {
        order_detail_ID: Number(item?.order_detail_ID),
        is_returned: 1,
        returned_product_name: item?.returned_product_name,
        returned_product_qty: item?.returned_product_qty,
        returned_product_size: item?.returned_product_size,
        returned_product_color: item?.returned_product_color,
        returned_product_price: item?.returned_product_price,
        returned_product_image: productImages,
        returned_product_reason: item?.returned_product_reason,
        request_return_date: new Date(),
      };
    });

    // create all return requests in one database call
    await prisma.returns.createMany({
      data: returnRecords,
    });

    // revalidate cache
    // customer side
    updateTag("order-history");

    // admin side
    updateTag("orders");

    return {
      successMessage:
        "Return request submitted successfully. Please wait for approval.",
      status: 200,
    };
  } catch (err: unknown) {
    // console.error("Submit return request error:", err);

    // Handle specific errors
    let errorMessage = "Failed to submit return request";
    let status = 500;

    if (err instanceof Error) {
      if (
        err.message.includes("foreign key constraint") ||
        err.message.includes("order_detail_ID")
      ) {
        errorMessage = "Invalid order data";
        status = 400;
      } else if (err.message.includes("duplicate")) {
        errorMessage = "Return request already exists for this item";
        status = 409;
      } else {
        errorMessage = err.message;
      }
    }

    return {
      errorMessage,
      status,
    };
  }
};