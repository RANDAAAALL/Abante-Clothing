import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

// get all tshirt product items
export async function GET() {
  const products = await prisma.product_items.findMany({
    select: {
      product_item_ID: true,
      product_item_image: true,
      product_item_name: true,
      product_item_price: true,
      product_item_color: true,
      product_item_size: true,
    }
  });

  const tShirtsPropsData = products.map((p) => ({
    ...p,
    alt: `${p.product_item_ID}-${p.product_item_name} alt`,
    discount: 30,
}))

  return NextResponse.json(
    {
      message: "fetched successfully",
      tShirtsPropsData
    }
  );
}
