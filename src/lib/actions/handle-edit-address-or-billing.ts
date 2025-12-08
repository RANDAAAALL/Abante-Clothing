// app/actions/edit-address.ts
"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { AddressAndBillingSchema } from "@/lib/validations/address-and-billing-schema";
import { redirect } from "next/navigation";

export type EditAddressFormData = {
  recipientFirstName: string;
  recipientLastName: string;
  companyName?: string;
  addressName: string;
  apartmentName?: string;
  postalCode: string;
  cityName: string;
  regionName: string;
  phoneNumber: string;
  country?: string;
};

export async function actionEditAddressOrBilling(
  address_ID: number,
  title: string,
  formData: EditAddressFormData
) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) redirect("/login");

    // get user payload
    const payload = await UserPayload();
    if (!payload)redirect("/login");

    // validate input
    if (!title || !address_ID || !formData) {
      return {
        errorMessage: "Invalid form, please try again.",
        status: 400
      };
    }

    // validate form data with schema
    const parsedFormData = AddressAndBillingSchema.safeParse(formData);
    if (!parsedFormData.success) {
      return {
        errorMessage: "Invalid form data. Please check all fields.",
        status: 400,
        errors: parsedFormData.error
      };
    }

    const addressType = title?.toLowerCase().includes("billing") ? "billing" : "shipping";

    // check if address is used in active orders
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
        errorMessage: "You cannot update this address because it is used in an order that is not yet delivered.",
        status: 400
      };
    }

    //  perform update
    await prisma.address.update({
    where: { address_ID: address_ID, user_ID: Number(payload.user_ID) },
    data: {
        address_type: addressType,
        recipient_first_name: parsedFormData.data.recipientFirstName,
        recipient_last_name: parsedFormData.data.recipientLastName,
        company_name: parsedFormData.data.companyName,
        address_name: parsedFormData.data.addressName,
        apartment_name: parsedFormData.data.apartmentName,
        postal_code: parsedFormData.data.postalCode,
        city_name: parsedFormData.data.cityName,
        region_name: parsedFormData.data.regionName,
        phone_number: parsedFormData.data.phoneNumber,
    },
    });

    // 9. Revalidate cache
    updateTag(addressType);
    updateTag("get-address-and-billing");

    return {
      successMessage: "Address updated successfully",
      status: 200,
    };
  } catch (error) {
    // console.error("Update address error:", error);
    return {
      errorMessage: error instanceof Error ? error.message : "Failed to update address.",
      status: 500
    };
  }
};