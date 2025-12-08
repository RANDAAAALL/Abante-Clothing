"use server"

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { redirect } from "next/navigation";
import { UserPayload } from "../security/payloads/get-user-payload";

export async function actionSelectAddress(address_ID: number, title: string) {
 //  check if user is logged in
 if (!(await isAuthenticatedUser())) return redirect("/login");

 const payload = await UserPayload();
 if (!payload) return redirect("/login");
  
  const addressType = title.includes("billing") ? "billing" : "shipping";
  
  try {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { 
          user_ID: Number(payload.user_ID), 
          address_type: addressType 
        },
        data: { is_selected: false },
      }),
      prisma.address.update({
        where: { address_ID },
        data: { is_selected: true },
      }),
    ]);

    updateTag(addressType);
    updateTag("get-address-and-billing");

  return {  
      successMessage: `Selected successfully.`,
      status: 200, 
    };
  } catch (error) {
    console.error("Select address error:", error);
    return { 
      errorMessage: error instanceof Error ? error.message : "Failed to select.",
      status: 500
    };
  }
}