import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { getDiscountedPrice } from "@/lib/helper/get-discounted-price";

export async function POST(req: NextRequest) {
  // check if user is logged in
  if(!await isAuthenticatedUser()) return NextResponse.redirect("/login");
  if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 
  
  const payload = await UserPayload();

  try {
    const { product, selectedSizeQtyAndColor } = await req.json();

    // check if this product+size already exists in cart
    const existing = await prisma.cart_items.findFirst({
      where: {
        user_ID: Number(payload.user_ID),
        product_item_ID: product.product_item_ID,
        cart_item_size: selectedSizeQtyAndColor.size,
        cart_item_color: selectedSizeQtyAndColor.color,
      },
    });

    let cartItem;
    const discountedPrice = Math.round(getDiscountedPrice(product.product_item_price ?? 0, product.product_item_discount ?? 0));

    if (existing) {
      // update qty and total if it already exists
      const newQty = (existing.cart_item_qty ?? 0) + selectedSizeQtyAndColor.qty;

      cartItem = await prisma.cart_items.update({
        where: { cart_item_ID: existing.cart_item_ID },
        data: {
          cart_item_qty: newQty,
          cart_item_total: discountedPrice * newQty,
          // cart_item_total: (product.product_item_price ?? 0) * newQty,
        },
      });

      // return NextResponse.json({ message: "Cart updated" });
      return NextResponse.json( cartItem );
    }

    // create new row if product+size doesn't exist
    cartItem = await prisma.cart_items.create({
      data: {
        user_ID: Number(payload.user_ID),
        product_item_ID: product.product_item_ID,
        cart_item_image: product.product_item_image,
        cart_item_name: product.product_item_name,
        cart_item_price:  discountedPrice,
        cart_item_size: selectedSizeQtyAndColor.size,
        cart_item_color: selectedSizeQtyAndColor.color,
        cart_item_qty: selectedSizeQtyAndColor.qty,
        cart_item_total: discountedPrice * selectedSizeQtyAndColor.qty,
        cart_item_date: new Date(),
      },
    });

    // console.log("Server ->  ",cartItem)
    // return NextResponse.json({ message: "Item added to cart" });
    return NextResponse.json( cartItem );
  } catch (err: unknown) {
    // console.error("Failed to add to cart:", err);
    return NextResponse.json({ errorMessage: err instanceof Error ? err.message : "Failed to add to cart" }, { status: 500 });
  }
}
