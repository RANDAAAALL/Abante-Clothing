import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { SalesDataProps } from "../types/sales-data-type";

export const getSalesCached = unstable_cache( async () => {
    const salesData = await prisma.order_purchased.findMany({
        select: {
            order_purchased_totalAmount: true,
            order_purchased_date: true,
            order_details: {
                select: {
                    order_detail_qty: true,
                }
            }
        }
    });

    const parsedSalesData: SalesDataProps[] = salesData.map((sales) => ({
        order_purchased_date: sales?.order_purchased_date ?? "",
        order_purchased_totalAmount: Number(sales?.order_purchased_totalAmount) ?? 0,
        order_detail_qty: sales?.order_details?.map((q) => q.order_detail_qty) ?? [],
    }));

    return parsedSalesData;
}, ["sales"], { tags: ["sales"] })

