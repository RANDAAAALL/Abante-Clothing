import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ address_ID: string }> }
) {
  // check if user is logged in
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
  if (!verifyCsrfToken(request))
    return NextResponse.json(
      { errorMessage: "Invalid CSRF Token" },
      { status: 403 }
    );

  const payload = await UserPayload();
  if (!payload) return NextResponse.redirect("/login");

  const { title } = await request.json();
  const address_ID = (await params).address_ID;
  if (!address_ID || !title) return NextResponse.json({ errorMessage: "Invalid, failed to remove" }, { status: 400 });

  const addressType = title?.includes("billing") ? "billing" : "shipping";
  const parsedAddressID = Number(address_ID);

  try {
    await prisma.address.update({
        where: { user_ID: Number(payload.user_ID), address_ID: parsedAddressID, address_type: addressType },
        data: { is_selected: false }
    })

    // revalidate the relevant cache tags
    revalidateTag(addressType, {});
    revalidateTag("get-address-and-billing", {});
    
    return NextResponse.json(
      { successMessage: `Removed successfully.` },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json({
      errorMessage:
        err instanceof Error ? err.message : "Failed to remove.",
    }, { status: 500 });
  }
}
