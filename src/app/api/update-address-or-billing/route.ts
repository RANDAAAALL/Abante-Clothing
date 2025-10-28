import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { AddressAndBillingSchema } from "@/lib/validations/address-and-billing-schema";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function PUT(request: NextRequest) {
  //  check if user is logged in
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
  if (!verifyCsrfToken(request))
    return NextResponse.json(
      { errorMessage: "Invalid CSRF Token" },
      { status: 403 }
    );

  const payload = await UserPayload();
  if (!payload) return NextResponse.redirect("/login");

  try {
    const { title, address_ID, formData } = await request.json();
    // console.log(title, address_ID, formData);

    // parsed datas
    const parsedFormData = AddressAndBillingSchema.safeParse(formData);
    if (!parsedFormData.success || !title || !address_ID) return NextResponse.json({ errorMessage: `Invalid form, please try again.` }, { status: 400 });

    const addressType = title?.includes("billing") ? "billing" : "shipping";
    const parsedAddressID = Number(address_ID);

    // check if this address is used in any pending orders
    const pendingOrder = await prisma.order_purchased.findFirst({
      where: {
        OR: [
          { delivery_address_ID: parsedAddressID },
          { billing_address_ID: parsedAddressID },
        ],
        AND: {
          OR: [
            { order_purchased_status: "pending" },
            { order_purchased_tracking_number: "pending" },
          ],
        },
      },
    });

    if (pendingOrder) {
      return NextResponse.json(
        { errorMessage: `You cannot update this address because it is used in a pending order.`},
        { status: 400 }
      );
    }

    //  perform update
    await prisma.address.update({
      where: { address_ID: parsedAddressID, user_ID: Number(payload.user_ID) },
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

    // revalidate cache
    revalidateTag(addressType);
    revalidateTag("get-address-and-billing");
    
    return NextResponse.json(
      { successMessage: "Updated successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Update address error:", err);
    return NextResponse.json({
      errorMessage:
        err instanceof Error ? err.message : "Failed to update address.",
    });
  }
}
