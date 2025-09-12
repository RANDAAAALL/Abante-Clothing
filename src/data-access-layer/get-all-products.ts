import prisma from "@/lib/prisma/prisma";
// import { SlugProps } from "../lib/types/slug-types";
import { TshirtType } from "../lib/types/t-shirt-types";

export const getAllProducts = async () => {
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
  
    const AllProducts: TshirtType[] = temp.map((p) => ({
      ...p,
      product_item_price: p.product_item_price?.toNumber(),
      alt: `${p.product_item_ID}-${p.product_item_name} alt`,
      discount: 30,
    }));

    return AllProducts;
}