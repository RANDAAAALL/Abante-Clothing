import prisma from "@/lib/prisma/prisma";
import { unstable_cache } from "next/cache";
import { firstLetterUpcase } from "../helper/first-letter-uppercase";
import { OrderReceiptModalProps } from "../types/order-history-receipt-types";

export const getOrderHistoryCached = unstable_cache(async(user_ID: number) => {
    const orderReceiptData = await prisma.order_purchased.findMany({
      where: { user_ID },
      select: {
        order_purchased_tracking_number: true,
        order_purchased_number: true,
        order_purchased_totalAmount: true,
        order_purchased_status: true,
        order_purchased_date: true,

        payments: {
          select: { payment_method: true },
        },

        address_order_purchased_delivery_address_IDToaddress: {
          select: {
            address_ID: true,
            recipient_first_name: true,
            recipient_last_name: true,
            company_name: true,
            apartment_name: true,
            address_name: true,
            postal_code: true,
            city_name: true,
            region_name: true,
            phone_number: true,
            address_type: true,
          },
        },

        address_order_purchased_billing_address_IDToaddress: {
          select: {
            address_ID: true,
            recipient_first_name: true,
            recipient_last_name: true,
            company_name: true,
            apartment_name: true,
            address_name: true,
            postal_code: true,
            city_name: true,
            region_name: true,
            phone_number: true,
            address_type: true,
          },
        },

        order_details: {
          select: {
            order_detail_ID: true,
            order_purchased_ID: true,
            order_detail_name: true,
            order_detail_qty: true,
            order_detail_size: true,
            order_detail_price: true,

            // New returns structure
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
              },
            },

            product_items: {
              select: {
                product_item_image: true,
                product_item_color: true,
              },
            },
            users_feedback: {
              where: { user_ID },
              select: {
                feedback_comment: true,
                feedback_rating: true,
              }
            }
          },
        },
      },
      orderBy: { order_purchased_date: "desc" },
    });

    // Parse the data to convert Decimal to number and handle JSON fields
    const parsedOrderReceiptData = orderReceiptData.map(order => ({
      ...order,
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

    const tableData = parsedOrderReceiptData.map(order => ({
      "Order #": order.order_purchased_number ?? "-",
      "Status": order.order_purchased_status
        ? order.order_purchased_status
        : "-",
      "Tracking #": order.order_purchased_tracking_number
      ? order.order_purchased_tracking_number
      : "-",
      "Items": order.order_details.reduce(
        (acc, detail) => acc + (detail.order_detail_qty ?? 0),
        0
      ),
      "Payment": order.payments?.payment_method
        ? firstLetterUpcase(order.payments.payment_method)
        : "-",
      "Date": order.order_purchased_date
        ? new Date(order.order_purchased_date).toLocaleDateString()
        : "-",
      "Actions": ["View Receipt", "Receive Order", "Request Return"]
    }));

    const orderReceiptModalData: OrderReceiptModalProps[] = parsedOrderReceiptData.map(order => {
      
      // Always get shipping address info
      const shippingAddress = order.address_order_purchased_delivery_address_IDToaddress;
      const billingAddress = order.address_order_purchased_billing_address_IDToaddress;
    
      // Determine if user used a separate billing address
      const isDifferentBilling =
        billingAddress &&
        billingAddress.address_ID !== shippingAddress?.address_ID;
    
      return {
        // Always display shipping info for these fields
        recipientFirstName: shippingAddress?.recipient_first_name ?? "-",
        recipientLastName: shippingAddress?.recipient_last_name ?? "-",
        addressName: shippingAddress?.address_name ?? "-",
        postalCode: shippingAddress?.postal_code ?? "-",
        cityName: shippingAddress?.city_name ?? "-",
        regionName: shippingAddress?.region_name ?? "-",
        phoneNumber: shippingAddress?.phone_number ?? "-",
        companyName: shippingAddress?.company_name ?? "-",
        apartmentName: shippingAddress?.apartment_name ?? "-",
    
        // But the label reflects what user selected
        addressType: isDifferentBilling ? "billing-address" : "shipping-address",
    
        // Other order info
        orderNumber: order.order_purchased_number ?? "-",
        orderPurchasedDate: order.order_purchased_date ?? "-",
        productDetails:
          order.order_details?.map(detail => ({
            order_detail_ID: detail.order_detail_ID ?? 0,
            order_purchased_ID: detail.order_purchased_ID ?? 0,
            name: detail.order_detail_name ?? "-",
            image: detail.product_items?.product_item_image ?? "-",
            qty: detail.order_detail_qty ?? "-",
            size: detail.order_detail_size ?? "-",
            color: detail.product_items?.product_item_color ?? "-",
            price: Number(detail.order_detail_price) ?? 0,
            feedback_comment: detail.users_feedback?.[0]?.feedback_comment ?? "",
            feedback_rating: detail.users_feedback?.[0]?.feedback_rating ?? 0,

            // New returns structure
            returns: detail.returns || []
          })) ?? [],
        paymentMethod: (order.payments?.payment_method ?? "-") as
          | "gcash"
          | "paymaya"
          | "bank-transfer",
        totalAmount: Number(order.order_purchased_totalAmount ?? 0),
        country: "Philippines",
      };
    });
    
    return { tableData, orderReceiptModalData };
}, ["order-history"], { tags: ["order-history"]})