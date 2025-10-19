import prisma from "@/lib/prisma/prisma";
import { unstable_cache } from "next/cache";

export const getOrderHistoryCached = unstable_cache(async (user_ID: number) => {
    // console.log("getOrderHistory HIT (unstable_cache)");

    const data = await prisma.order_purchased.findMany({
        where: { user_ID: user_ID},
        select: {
            order_purchased_number: true,
            order_purchased_date: true,    
            order_details: {
                select: {
                    order_detail_name: true,
                    order_detail_qty: true,
                    order_detail_size: true,
                    order_detail_price: true,
                    product_items: {
                        select: {
                            product_item_back_image: true,
                        }
                    }
                },
            }
       }
    });

    // format the data
    const tableData = data.flatMap(order =>
        order.order_details.map(detail => ({
          "ORD-NO": order.order_purchased_number ? order.order_purchased_number : "-",
          "Product": {
            name: detail.order_detail_name
              ? detail.order_detail_name[0].toUpperCase() + detail.order_detail_name.slice(1)
              : "-",
            image: detail.product_items?.product_item_back_image ?? null,
          },
          "Quantity": detail.order_detail_qty ? detail.order_detail_qty : 0,
          "Price": detail.order_detail_price ? Number(detail.order_detail_price) : 0,
          "Size": detail.order_detail_size ? detail.order_detail_size : "-",
          "Purchased Date": order.order_purchased_date
            ? new Date(order.order_purchased_date).toLocaleDateString()
            : "-", 
        }))
      );
      
     return tableData;
}, ["order-history"], { tags: ["order-history"] });