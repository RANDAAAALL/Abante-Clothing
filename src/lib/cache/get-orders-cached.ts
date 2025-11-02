import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";

export const getOrdersCached = unstable_cache(async () => {
  const ordersData = await prisma.order_purchased.findMany({
    where: {
      // Only fetch orders that have a shipping/delivery address of type "shipping"
      address_order_purchased_delivery_address_IDToaddress: {
        address_type: "shipping",
      },
    },
    select: {

      order_purchased_number: true, // Order ID column 

      // Customer column
      address_order_purchased_delivery_address_IDToaddress: {
        select: {
          recipient_first_name: true,
          recipient_last_name: true,
        },
      },
      
      // Products column
      order_details: {
        select: {
          order_detail_name: true,
          order_detail_qty: true,
          order_detail_size: true,
          product_items: {
            select: {
              product_item_color: true,
            },
          },
        },
      },

      // Total column
      payments: {
        select: {
          payment_amount: true,
        },
      },

      order_purchased_status: true, // Status column -> pending, processing, shipped, delivered
      order_purchased_tracking_number: true, // Tracking # column

      // Date column
      order_purchased_date: true,
    },
    
    orderBy: {
      order_purchased_date: "desc",
    },
  });

  const parsedOrdersData = ordersData.map((order) => ({
    ...order,
    payments: order.payments
      ? {
          ...order.payments,
          payment_amount: order.payments.payment_amount
            ? Number(order.payments.payment_amount)
            : null,
        }
      : null,
  }));

  return parsedOrdersData;
}, ["orders"], { tags: ["orders"] });
