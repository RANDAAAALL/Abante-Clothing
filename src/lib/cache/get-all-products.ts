// lib/cache/get-all-products.ts
import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { TshirtType } from "../types/t-shirt-types";

export const getAllProductsCached = unstable_cache(
  async () => {
    try {
      const temp = await prisma.product_items.findMany({
        where: { product_item_status: "available" },
        distinct: ["product_item_name"],
        select: {
          product_item_ID: true,
          product_item_name: true,
          product_item_color: true,
          product_item_price: true,
          product_item_type: true,
          product_item_fit: true,
          product_item_discount: true,
          product_item_image: true,
          product_item_size: true,
        },
      });

      if (!temp || temp.length === 0) return [];

      const AllRelatedProducts: TshirtType[] = temp.map((p) => ({
        ...p,
        product_item_price:
          typeof p.product_item_price === "number"
            ? p.product_item_price
            : p.product_item_price?.toNumber?.() ?? 0,
        alt: `${p.product_item_ID}-${p.product_item_name} alt`,
      }));

      return AllRelatedProducts;
    } catch (err: unknown) {
      console.error(
        "[getAllProductsCached] Failed to fetch products:",
        err instanceof Error ? err.message : err
      );
      return [];
    }
  },
  ["all-products"],
  { tags: ["all-products"], revalidate: 30 } 
);
