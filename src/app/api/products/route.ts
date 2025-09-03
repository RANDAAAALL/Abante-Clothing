import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

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

  return NextResponse.json(
    {
      message: "fetched successfully",
      products
    },
    {
      headers: { "Access-Control-Allow-Origin": "*" }
    }
  );
}
