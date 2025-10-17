import prisma from "@/lib/prisma/prisma";
import { TshirtType } from "../lib/types/t-shirt-types";
export const getAllRelatedProducts = async () => {
    try{
      const temp = await prisma.product_items.findMany({
        distinct: ["product_item_name"], // retrieve only unique product/s based on product name
        select: {
          product_item_ID: true,
          product_item_name: true,
          product_item_color: true,
          product_item_price: true,
          product_item_image: true,
          product_item_size: true,
        },
      });
    
      if(!temp) throw new Error("All Products Not Found!");
    
      const AllRelatedProducts: TshirtType[] = temp.map((p) => ({
        ...p, 
        product_item_price: p.product_item_price?.toNumber(),
        alt: `${p.product_item_ID}-${p.product_item_name} alt`,
        discount: 30,
      }));
  
      return AllRelatedProducts;
    }catch(err){
      console.log(err);
      return;
    }
}