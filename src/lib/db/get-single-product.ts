import prisma from "@/lib/prisma/prisma";
import { SlugProps } from "../types/slug-types";

export const getSingleProduct = async ( {slug}: SlugProps) => {
    const SingleProduct = await prisma.product_items.findFirst({
      where: { product_item_name: slug },
      select: {
        product_item_ID: true,
        product_item_name: true,
        product_item_price: true,
        product_item_image: true,
        product_item_back_image: true,
        product_item_size: true,
        product_item_material: true,
        product_item_construction: true,
        product_item_design_features: true,
      },
    });
  
    if(!SingleProduct) console.error("Single Product Not Found!");
  
    return SingleProduct;
}

  