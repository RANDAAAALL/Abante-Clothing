// app/actions/add-address.ts
"use server";

import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { AddressAndBillingSchema } from "@/lib/validations/address-and-billing-schema";
import { redirect } from "next/navigation";

export type AddressFormData = {
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

export async function actionAddAddressOrBilling(title: string, formData: AddressFormData) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) redirect("/login");

    // get user payload
    const payload = await UserPayload();
    if (!payload) redirect("/login");

    const user_ID = Number(payload.user_ID);

    // validate form data
    const parsedFormData = AddressAndBillingSchema.safeParse(formData);
    if (!parsedFormData.success || !title) {
      return { 
        errorMessage: `Invalid form, please try again.`, 
        status: 400 
      };
    }

    const addressType = title?.includes("billing") ? "billing" : "shipping";

    // check if address already exists
    const isAddressAlreadyExists = await prisma.address.findFirst({
      where: {
        user_ID: user_ID,
        address_type: addressType,
        recipient_first_name: parsedFormData.data.recipientFirstName,
        recipient_last_name: parsedFormData.data.recipientLastName,
        address_name: parsedFormData.data.addressName,
        city_name: parsedFormData.data.cityName,
        region_name: parsedFormData.data.regionName,
        postal_code: parsedFormData.data.postalCode,
        phone_number: parsedFormData.data.phoneNumber,
      }
    });

    if (isAddressAlreadyExists) {
      return {
        errorMessage: `${addressType === "shipping" ? "delivery" : addressType} address already exists. Please use a different address.`,
        status: 400
      };
    }

    // create new address
    await prisma.address.create({
      data: {
        user_ID: user_ID,
        address_type: addressType,
        recipient_first_name: parsedFormData.data.recipientFirstName,
        recipient_last_name: parsedFormData.data.recipientLastName,
        company_name: parsedFormData.data.companyName || null,
        address_name: parsedFormData.data.addressName,
        apartment_name: parsedFormData.data.apartmentName || null,
        postal_code: parsedFormData.data.postalCode,
        city_name: parsedFormData.data.cityName,
        region_name: parsedFormData.data.regionName,
        phone_number: parsedFormData.data.phoneNumber,
        is_selected: false 
      }
    });

    // revalidate cache
    updateTag(addressType);

    return {
      successMessage: "Address added successfully", 
      status: 200,
    };
  } catch (error) {
    // console.error("Add address error:", error);
    return {
      errorMessage: error instanceof Error ? error.message : "Failed to add address",
      status: 500
    };
  }
}