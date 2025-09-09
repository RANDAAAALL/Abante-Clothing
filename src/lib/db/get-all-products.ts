import prisma from "@/lib/prisma/prisma";
import { SlugProps } from "../types/slug-types";

export const getAllProducts = async ( {slug}: SlugProps) => {
    const temp = await prisma.product_items.findMany({
      select: {
        product_item_ID: true,
        product_item_name: true,
        product_item_price: true,
        product_item_image: true,
        product_item_size: true,
      },
    });
  
    if(!temp) console.error("All Products Not Found!");
  
    const AllProducts = temp.map((p) => ({
      ...p,
      product_item_price: p.product_item_price?.toString()
    }));
  
    return AllProducts;
}