import { redirect } from "next/navigation"
import { isAuthenticatedUser } from "./verify-user"
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import prisma from "@/lib/prisma/prisma";

export const getOrderHistory = async () => {
    if(!await isAuthenticatedUser()) redirect("/login");

    const payload = UserPayload();

    const data = await prisma.order_purchased.findMany({
        where: { user_ID: Number((await payload).user_ID) },
        select: {
            order_purchased_number: true,
            order_purchased_date: true,    
            order_details: {
                select: {
                    order_detail_name: true,
                    order_detail_qty: true,
                    order_detail_size: true,
                    order_detail_price: true,
                }
            }
       }
    });

    // format the data
    const tableData = data.flatMap(order =>
        order.order_details.map(detail => ({
          "ORD-NO": order.order_purchased_number ?? "-",
          "Product": detail.order_detail_name ? detail.order_detail_name[0].toUpperCase() + detail.order_detail_name.slice(1) : "-",
          "Quantity": detail.order_detail_qty ?? 0,
          "Price": detail.order_detail_price ? Number(detail.order_detail_price) : 0,
          "Size": detail.order_detail_size ?? "-",
          "Purchased Date": order.order_purchased_date
            ? new Date(order.order_purchased_date).toLocaleDateString()
            : "-", 
        }))
      );
      

     return tableData;
}