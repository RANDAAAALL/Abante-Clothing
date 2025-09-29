import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/data-access-layer/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";

export async function POST(req: Request) {
  // check if user is logged in
  if(!await isAuthenticatedUser()) return NextResponse.json({ errorMessage: "Unauthorized" }, { status: 401 });

  const payload = await UserPayload();

  try {
    const { product, selectedSizeAndQty } = await req.json();

    // check if this product+size already exists in cart
    const existing = await prisma.cart_items.findFirst({
      where: {
        user_ID: Number(payload.user_ID),
        product_item_ID: product.product_item_ID,
        cart_item_size: selectedSizeAndQty.size,
      },
    });

    if (existing) {
      // update qty and total if it already exists
      const newQty = (existing.cart_item_qty ?? 0) + selectedSizeAndQty.qty;

      await prisma.cart_items.update({
        where: { cart_item_ID: existing.cart_item_ID },
        data: {
          cart_item_qty: newQty,
          cart_item_total: (product.product_item_price ?? 0) * newQty,
        },
      });

      return NextResponse.json({ message: "Cart updated" });
    }

    // create new row if product+size doesn't exist
    await prisma.cart_items.create({
      data: {
        user_ID: Number(payload.user_ID),
        product_item_ID: product.product_item_ID,
        cart_item_image: product.product_item_image,
        cart_item_name: product.product_item_name,
        cart_item_price: product.product_item_price,
        cart_item_size: selectedSizeAndQty.size,
        cart_item_color: product.product_item_color,
        cart_item_qty: selectedSizeAndQty.qty,
        cart_item_total: (product.product_item_price ?? 0) * selectedSizeAndQty.qty,
        cart_item_date: new Date(),
      },
    });

    return NextResponse.json({ message: "Item added to cart" });
  } catch (err) {
    console.error("Failed to add to cart:", err);
    return NextResponse.json({ errorMessage: "Something went wrong" }, { status: 500 });
  }
}
