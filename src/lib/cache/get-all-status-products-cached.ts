import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";

export const getAllStatusProductsCached = unstable_cache(async () => {
    const statusProducts = await prisma.product_items.findMany({
        select: {
            product_item_ID: true,
            product_item_name: true,
            product_item_price: true,
            product_item_discount: true,
            product_item_image: true,
            product_item_color: true,
            product_item_size: true,
            product_item_type: true,
            product_item_fit: true,
            product_item_material: true,
            product_item_construction: true,
            product_item_design_features: true,
            product_item_stock: true,
            product_item_displayDate: true,
            product_item_back_image: true,
            product_item_status: true,
        }
    });

    // parsed status products
    return statusProducts.map((p) => ({
        ...p,
        product_item_price: p.product_item_price ? Number(p.product_item_price) : null,
        product_item_displayDate: p.product_item_displayDate
          ? p.product_item_displayDate.toISOString()
          : null,
      }));
}, ['all-status-products'], { tags: ['all-status-products']});