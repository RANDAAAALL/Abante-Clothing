import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";

export const getOrdersCached = unstable_cache(async() => {
  const ordersData = await prisma.order_purchased.findMany({
    where: {
      address_order_purchased_delivery_address_IDToaddress: {
        address_type: "shipping",
      },
    },
    select: {
      order_purchased_number: true,
      address_order_purchased_delivery_address_IDToaddress: {
        select: {
          recipient_first_name: true,
          recipient_last_name: true,
        },
      },
      order_details: {
        select: {
          order_detail_ID: true,
          order_detail_name: true,
          order_detail_qty: true,
          order_detail_size: true,
          product_items: {
            select: {
              product_item_color: true,
            },
          },
          returns: {
            select: {
              return_ID: true,
              order_detail_ID: true,
              is_returned: true,
              returned_product_name: true,  
              returned_product_price: true,
              returned_product_color: true,
              returned_product_qty: true,
              returned_product_size: true,
              returned_product_image: true,
              returned_product_reason: true, 
              request_return_date: true, 
              returned_date: true,
              is_return_accepted: true,
            }
          }
        },
      },
      payments: {
        select: {
          payment_amount: true,
        },
      },
      order_purchased_status: true,
      order_purchased_tracking_number: true,
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
    // Add parsing for returns
    order_details: order.order_details.map(detail => ({
      ...detail,
      returns: detail.returns?.map(returnItem => ({
        ...returnItem,
        returned_product_price: returnItem.returned_product_price
          ? Number(returnItem.returned_product_price)
          : null,
        // Handle JSON field - convert to string array or null
        returned_product_image: returnItem.returned_product_image 
          ? (Array.isArray(returnItem.returned_product_image) 
              ? returnItem.returned_product_image 
              : JSON.parse(returnItem.returned_product_image as string))
          : null,
      })) || []
    }))
  }));

  return parsedOrdersData;
}, ["orders"], { tags: ["orders"]} );