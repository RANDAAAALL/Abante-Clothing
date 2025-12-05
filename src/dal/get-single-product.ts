import prisma from "@/lib/prisma/prisma";
import { SlugProps } from "../lib/types/slug-types";
import { TshirtType } from "../lib/types/t-shirt-types";
import { cache } from "react";

const getSingleProduct = async ( {slug}: SlugProps) => {
    try{

      const products = await prisma.product_items.findMany({
        where: {  product_item_name: slug, product_item_status: "available" },
        select: {
          product_item_ID: true,
          product_item_name: true,
          product_item_price: true,
          product_item_fit: true,
          product_item_discount: true,
          product_item_image: true,
          product_item_back_image: true,
          product_item_size: true,
          product_item_color: true,
          product_item_material: true,
          product_item_construction: true,
          product_item_design_features: true,
          product_item_stock: true,
        },
      });
  
      if (!products || products.length === 0)
      throw new Error("No product variants found!");

      // convert prices to number and format data
      const formattedProducts: Partial<TshirtType>[] = products.map((p) => ({
        ...p,
        product_item_price: p.product_item_price?.toNumber(),
      }));

    return formattedProducts;
    }catch(err){
      console.error(err);
      return;
    }
}

export const cachedGetSingleProduct = cache(async (slug: string) => {
  return getSingleProduct({ slug });
});

  