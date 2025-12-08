// app/actions/remove-selected-address.ts (with updateTag)
"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { redirect } from "next/navigation";

export async function actionRemoveSelectedAddress(address_ID: number, title: string) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) redirect("/login");
    

    // get user payload
    const payload = await UserPayload();
    if (!payload) redirect("/login");
    
    const user_ID = Number(payload.user_ID);
    const addressType = title?.toLowerCase().includes("billing") ? "billing" : "shipping";

    // validate input
    if (!address_ID || !title) {
      return {
        success: false,
        message: "Invalid, failed to remove",
        status: 400
      };
    }

    // update database
    await prisma.address.update({
      where: { 
        user_ID: user_ID, 
        address_ID: address_ID, 
        address_type: addressType 
      },
      data: { is_selected: false }
    });

    // update cache tags 
    updateTag(addressType);
    updateTag("get-address-and-billing");

    return {
      successMessage: "Removed successfully.",
      status: 200,
    };
  } catch (error) {
    // console.error("Remove selected address error:", error);
    
    return {
      errorMessage: error instanceof Error ? error.message : "Failed to remove.",
      status: 500
    };
  }
}