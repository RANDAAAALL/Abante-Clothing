import { isAuthenticatedUser } from "@/dal/verify-user";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cart_item_id: string }> }
) {
  if (!await isAuthenticatedUser()) return NextResponse.redirect("/login");
  console.log("CSRF cookie:", req.cookies.get("csrf_token")?.value);
  console.log("CSRF header:", req.headers.get("x-csrf-token"));

  if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 

  const cart_item_id = (await params).cart_item_id

  const cartItemId = Number(cart_item_id);

  try {
    await prisma.cart_items.delete({
      where: { cart_item_ID: cartItemId },
    });

    return NextResponse.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { errorMessage: "Failed to delete cart item: " + err },
      { status: 500 }
    );
  }
}
