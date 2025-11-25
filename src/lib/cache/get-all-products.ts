import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { TshirtType } from "../types/t-shirt-types";

export const getAllProductsCached = unstable_cache(async () => {
    // console.log("getAllProductsCached triggered!");
    try{
        const temp = await prisma.product_items.findMany({
          where: { product_item_status: "available" },
          distinct: ["product_item_name"], // retrieve only unique product/s based on product name
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
      
        if(!temp) throw new Error("All Products Not Found!");
      
        const AllRelatedProducts: TshirtType[] = temp.map((p) => ({
          ...p, 
          product_item_price: p.product_item_price?.toNumber(),
          alt: `${p.product_item_ID}-${p.product_item_name} alt`,
        }));
    
        return AllRelatedProducts;
      }catch(err: unknown){
        console.log(err instanceof Error ? err.message : "Failed to fetch all products");
        return;
      }

}, ["all-products"], { tags: ["all-products"], revalidate: 30 });