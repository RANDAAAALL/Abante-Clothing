"use server";
import { updateTag } from "next/cache";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { CheckoutFormType, CheckoutSchema } from "@/lib/validations/checkout-schema";
import { CartItemsProps } from "@/lib/types/cart-items-types";
import { ComputeItemState } from "@/lib/store/checkout-items";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";

export async function actionProcessCheckout(
  checkoutFormData: CheckoutFormType | null,
  itemsData: CartItemsProps[] | null,
  computeItems: ComputeItemState | null
) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) redirect("/login");

    // get user payload
    const payload = await UserPayload();
    if (!payload) redirect("/login");
    
    const userID = Number(payload.user_ID);
    
    // generate order reference
    const now = new Date();
    const orderRef = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${nanoid(6).toUpperCase()}`;

    // validate input data
    const parsed = CheckoutSchema.safeParse(checkoutFormData);
    const cartItems = itemsData as CartItemsProps[];
    const overallPrice = computeItems as ComputeItemState;
    
    if (!parsed.success || !cartItems?.length || overallPrice.overallPriceResult <= 0) {
      return {
        errorMessage: "Invalid checkout data",
        status: 400
      };
    }

    const checkoutForm = parsed.data;

    // process checkout in transaction
    const result = await prisma.$transaction(async (tx) => {
     
      // find or create shipping address
      let shippingAddress = await tx.address.findFirst({
        where: {
          user_ID: userID,
          address_name: checkoutForm.addressName,
          city_name: checkoutForm.cityName,
          region_name: checkoutForm.regionName,
          postal_code: checkoutForm.postalCode,
          phone_number: checkoutForm.phoneNumber,
          address_type: "shipping",
        },
      });

      if (!shippingAddress) {
        shippingAddress = await tx.address.create({
          data: {
            user_ID: userID,
            address_type: "shipping",
            recipient_first_name: checkoutForm.recipientFirstName,
            recipient_last_name: checkoutForm.recipientLastName,
            company_name: checkoutForm.companyName,
            address_name: checkoutForm.addressName,
            apartment_name: checkoutForm.apartmentName,
            postal_code: checkoutForm.postalCode,
            city_name: checkoutForm.cityName,
            region_name: checkoutForm.regionName,
            phone_number: checkoutForm.phoneNumber,
          },
        });
      }

      // check if user selected different billing address
      let billingAddress = null;
      if (checkoutForm.addressType === "billing-address") {
        billingAddress = await tx.address.findFirst({
          where: {
            user_ID: userID,
            address_name: checkoutForm.billingAddressName!,
            city_name: checkoutForm.billingCityName!,
            region_name: checkoutForm.billingRegionName!,
            postal_code: checkoutForm.billingPostalCode!,
            phone_number: checkoutForm.billingPhoneNumber!,
            address_type: "billing",
          },
        });

        if (!billingAddress) {
          billingAddress = await tx.address.create({
            data: {
              user_ID: userID,
              address_type: "billing",
              recipient_first_name: checkoutForm.billingFirstName!,
              recipient_last_name: checkoutForm.billingLastName!,
              company_name: checkoutForm.billingCompanyName,
              address_name: checkoutForm.billingAddressName!,
              apartment_name: checkoutForm.billingApartmentName,
              postal_code: checkoutForm.billingPostalCode!,
              city_name: checkoutForm.billingCityName!,
              region_name: checkoutForm.billingRegionName!,
              phone_number: checkoutForm.billingPhoneNumber!,
            },
          });
        }
      }

      // update product stock
      for (const item of cartItems) {
        const currentProductItemStock = await tx.product_items.findUnique({
          where: { product_item_ID: Number(item.product_item_ID) },
          select: { product_item_stock: true },
        });

        const newStock = Number(currentProductItemStock?.product_item_stock) - Number(item.cart_item_qty);
        
        if (newStock < 0) throw new Error(`Insufficient stock for ${item.cart_item_name}. Please check the stock and try again.`);

        await tx.product_items.update({
          where: { product_item_ID: Number(item.product_item_ID) },
          data: {
            product_item_stock: newStock,
            product_item_status: newStock === 0 ? "not available" : "available",
          },
        });
      }

      // create payment
      const payment = await tx.payments.create({
        data: {
          user_ID: userID,
          payment_method: checkoutForm.paymentMethod,
          payment_amount: overallPrice.overallPriceResult,
        },
      });

      // create order_purchased
      const orderPurchased = await tx.order_purchased.create({
        data: {
          user_ID: userID,
          delivery_address_ID: shippingAddress.address_ID,
          billing_address_ID: billingAddress ? billingAddress.address_ID : shippingAddress.address_ID,
          payment_ID: payment.payment_ID,
          order_purchased_number: orderRef,
          order_purchased_tracking_number: "pending",
          order_purchased_totalAmount: overallPrice.overallPriceResult,
          order_purchased_status: "pending",
        },
      });

      // create order_details
      await tx.order_details.createMany({
        data: cartItems.map((item) => ({
          order_purchased_ID: orderPurchased.order_purchased_ID,
          product_item_ID: item.product_item_ID,
          order_detail_name: item.cart_item_name,
          order_detail_qty: item.cart_item_qty,
          order_detail_price: item.cart_item_price,
          order_detail_size: item.cart_item_size,
        })),
      });

      return {
        orderPurchased,
        shippingAddress,
        billingAddress,
        payment
      };
    }, {
      timeout: 15000,
    //   maxWait: 5000
    });

    // revalidate cache tags
    // customer side
    updateTag("order-history");
    updateTag("billing");
    updateTag("shipping");
    updateTag("all-products");
    updateTag("all-status-products");
    updateTag("single-product");
    
    // admin side
    updateTag("sales");
    updateTag("orders");
    updateTag("admin-dashboard");

    return {
      successMessage: "Order placed successfully!",
      status: 200,
      actualData: {
        order_purchased_date: result.orderPurchased.order_purchased_date?.toDateString(),
        orderNumber: result.orderPurchased.order_purchased_number,
        total: overallPrice.overallPriceResult
      }
    };
  } catch (error) {
    // console.error("Checkout Error:", error);
    
    // handle specific errors
    let errorMessage = "Failed to process checkout";
    let status = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes("Insufficient stock")) {
        status = 400;
      } else if (error.message.includes("timeout") || error.message.includes("Transaction")) {
        status = 408; 
      }
    }

    return {
      success: false,
      errorMessage,
      status
    };
  }
};