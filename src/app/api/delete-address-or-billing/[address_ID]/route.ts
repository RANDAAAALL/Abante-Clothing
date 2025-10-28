import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function DELETE(
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
  if (!address_ID || !title) return NextResponse.json({ errorMessage: "Failed to delete" }, { status: 400 });

  const addressType = title?.includes("billing") ? "billing" : "shipping";
  const parsedAddressID = Number(address_ID);

  try {
    const address = await prisma.address.findUnique({
      where: { address_ID: parsedAddressID },
    });

    if (!address || address.user_ID !== Number(payload.user_ID)) {
      return NextResponse.json(
        { errorMessage: "Unauthorized delete attempt." },
        { status: 403 }
      );
    }

    //  check if the address is used in any pending orders
    const pendingOrders = await prisma.order_purchased.findMany({
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

    if (pendingOrders.length > 0) {
      return NextResponse.json(
        { errorMessage: "You cannot delete this address because it is used in a pending order." },
        { status: 400 }
      );
    }

    // proceed with deletion if no pending orders
    await prisma.address.delete({ where: { address_ID: parsedAddressID } });

    // revalidate the relevant cache tags
    revalidateTag(addressType);
    revalidateTag("order-history");
    revalidateTag("get-address-and-billing");
    
    return NextResponse.json(
      { successMessage: "Deleted Successfully." },
      { status: 200 }
    );
  } catch (err: unknown) {
    return NextResponse.json({
      errorMessage:
        err instanceof Error ? err.message : "Failed to delete.",
    }, { status: 500 });
  }
}
