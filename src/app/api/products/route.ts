import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { TshirtType } from "@/lib/types/t-shirt-types";

// src/app/api/products/route.ts
export async function OPTIONS() {
  return NextResponse.json({}, { 
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}

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

  const tShirtsPropsData: TshirtType[] = products.map((p: TshirtType) => ({
    product_item_ID: p.product_item_ID,
    product_item_image: p.product_item_image,
    product_item_name: p.product_item_name,
    product_item_color: p.product_item_color,
    product_item_size: p.product_item_size,
    product_item_price: p.product_item_price,
    alt: p.product_item_name,
    discount: 30,
}))

  return NextResponse.json(
    {
      message: "fetched successfully",
      tShirtsPropsData
    },
    {
      headers: { "Access-Control-Allow-Origin": "*" }
    }
  );
}
