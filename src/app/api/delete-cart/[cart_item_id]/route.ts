import { isAuthenticatedUser } from "@/data-access-layer/verify-user";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ cart_item_id: string }> }
) {
  if (!await isAuthenticatedUser()) {
    return NextResponse.json({ errorMessage: "Unauthorized" }, { status: 401 });
  }

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
