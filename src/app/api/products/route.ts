import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

// get all tshirt product items
export async function GET() {
  const products = await prisma.product_items.findMany({
    where: { product_item_discount: { gt: 0 }},
    distinct: ["product_item_name"], // retrieve only unique product/s based on product name
    select: {
      product_item_ID: true,
      product_item_image: true,
      product_item_name: true,
      product_item_price: true,
      product_item_discount: true,
      product_item_color: true,
      product_item_size: true,
    }
  });

  const tShirtsPropsData = products.map((p) => ({
    ...p,
    alt: `${p.product_item_ID}-${p.product_item_name} alt`,
}))

  return NextResponse.json(
    {
      successMessage: "fetched successfully",
      tShirtsPropsData
    }
  );
}
