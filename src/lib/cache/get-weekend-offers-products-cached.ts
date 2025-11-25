import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { TshirtType } from "../types/t-shirt-types";

export const getWeekendOffersProductsCached = unstable_cache(
  async () => {
    const weekendOffersProducts = await prisma.product_items.findMany({
      where: {
        AND: [
          { product_item_discount: { gt: 0 } },
          { product_item_status: "available" },
        ],
      },
      distinct: ["product_item_name"], // retrieve only unique product/s based on product name
      select: {
        product_item_ID: true,
        product_item_image: true,
        product_item_name: true,
        product_item_price: true,
        product_item_discount: true,
        product_item_color: true,
        product_item_size: true,
      },
    });

    const parsedWeekendOffersProducts = weekendOffersProducts.map((p) => ({
      ...p,
      alt: `${p.product_item_ID}-${p.product_item_name} alt`,
    }));

    return parsedWeekendOffersProducts as TshirtType[];
  },
  ["weekend-offers-products"],
  { tags: ["weekend-offers-products"], revalidate: 30 }
);
