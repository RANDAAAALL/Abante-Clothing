import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { AddressAndBillingSchema } from "@/lib/validations/address-and-billing-schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest){
  // check if user is logged in
  if(!await isAuthenticatedUser()) return NextResponse.redirect("/login");
  if(!verifyCsrfToken(request)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 
  
  const payload = await UserPayload();
  if(!payload) return NextResponse.redirect("/login");

  try{
    const { title, formData } = await request.json();
    console.log(title, formData);

    // parsed
    const parsedFormData = AddressAndBillingSchema.safeParse(formData);
    if(!parsedFormData.success || !title)  return NextResponse.json({ errorMessage: `Invalid form, please try again.` }, { status: 400 });

    const addressType = title?.includes("billing") ? "billing" : "shipping";

    const isAddressAlreadyExists = await prisma.address.findFirst({
        where: {
            user_ID: Number(payload.user_ID),
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

    if(isAddressAlreadyExists) {
        return NextResponse.json(
            { errorMessage: "Address is already exist. Please use different address." },
            { status: 400 }
        )
    }else {
        await prisma.address.create({
            data: {
                user_ID: Number(payload.user_ID),
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
            }
        })
        
        // revalidate the tag/s, to fecth fresh data on billing address
        revalidateTag(addressType);

        return NextResponse.json(
            { successMessage: "Added successfully" },
            { status: 200 }
        )
    }
  }catch(err: unknown){
    return NextResponse.json({ errroMessage: err instanceof Error ? err.message : "Failed to add"});
  }
}