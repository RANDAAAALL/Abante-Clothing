

import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { SelectedAddressOrBillingProps } from "@/lib/interface/selected-address-or-billing";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{title: string}>}){
  // check if user is logged in
  if(!await isAuthenticatedUser()) return NextResponse.redirect("/login");
  if(!verifyCsrfToken(request)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 
  
  const payload = await UserPayload();
  if(!payload) return NextResponse.redirect("/login");

  const title = (await params).title;

  if(!title) return NextResponse.json({ errorMessage: `Invalid, please try again.` }, { status: 400 });
  const addressType = title?.includes("billing") ? "billing" : "shipping";

  try{
    const selectedData = await prisma.address.findFirst({
        where: {
            user_ID: Number(payload.user_ID),
            address_type: addressType,
            is_selected: true 
        },
    });
    if (!selectedData) return NextResponse.json({ parsedSelectedData: null }, { status: 200 });    

    // parsed selected data
    const parsedSelectedData: SelectedAddressOrBillingProps = {
      country: "Philippines",
      address_ID: selectedData.address_ID,
      addressType: selectedData.address_type ?? "",
      recipientFirstName: selectedData.recipient_first_name ?? "",
      recipientLastName: selectedData.recipient_last_name ?? "",
      companyName: selectedData.company_name ?? "",
      addressName: selectedData.address_name ?? "",
      apartmentName: selectedData.apartment_name ?? "",
      postalCode: selectedData.postal_code ?? "",
      cityName: selectedData.city_name ?? "",
      regionName: selectedData.region_name ?? "",
      phoneNumber: selectedData.phone_number ?? "",
      is_selected: selectedData.is_selected ?? false,
    };

    return NextResponse.json({ parsedSelectedData }, { status: 200 });
  }catch(err: unknown){
    return NextResponse.json({ errroMessage: err instanceof Error ? err.message : `Failed to get selected ${title}`});
  }
}