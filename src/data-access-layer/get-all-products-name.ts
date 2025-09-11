import prisma from "@/lib/prisma/prisma";

export const getAllProductsName = async () => {
    const AllProductsName = await prisma.product_items.findMany({
        select: { product_item_name: true },
    });
 
    if(!AllProductsName) console.error("Products Name not found", AllProductsName);

    return AllProductsName;
}