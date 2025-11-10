import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { CheckoutSchema } from "@/lib/validations/checkout-schema";
import { CartItemsProps } from "@/lib/types/cart-items-types";
import { ComputeItemState } from "@/lib/store/checkout-items";
import { nanoid } from "nanoid";
import { revalidateTag } from "next/cache";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";

export async function POST(req: NextRequest) {
    if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
    if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 

    const payload = await UserPayload();
    const userID = Number(payload?.user_ID);
    const now = new Date();
    const orderRef = `ORD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${nanoid(6).toUpperCase()}`

    try {
        const { submittedFormCheckoutFormData, itemsData, computeItems } = await req.json();
       
        // safeParse
        const parsed = CheckoutSchema.safeParse(submittedFormCheckoutFormData);
        const cartItems = itemsData as CartItemsProps[];
        const overallPrice = computeItems as ComputeItemState;
        
        if ( !parsed.success || !cartItems?.length || overallPrice.overallPriceResult <= 0) {
        return NextResponse.json(
            { errorMessage: `Invalid checkout data` },
            { status: 400 }
        );
        }

        const checkoutForm = parsed.data;
        const result = await prisma.$transaction(async (tx) => {
          
            // check if shipping address is already exists
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
              // check if billing address is already exists
              billingAddress = await tx.address.findFirst({
                where: {
                  user_ID: userID,
                  address_name: checkoutForm.billingAddressName,
                  city_name: checkoutForm.billingCityName,
                  region_name: checkoutForm.billingRegionName,
                  postal_code: checkoutForm.billingPostalCode,
                  phone_number: checkoutForm.billingPhoneNumber,
                  address_type: "billing",
                },
              });
            
              if (!billingAddress) {
                billingAddress = await tx.address.create({
                  data: {
                    user_ID: userID,
                    address_type: "billing",
                    recipient_first_name: checkoutForm?.billingFirstName,
                    recipient_last_name: checkoutForm.billingLastName,
                    company_name: checkoutForm.billingCompanyName,
                    address_name: checkoutForm.billingAddressName,
                    apartment_name: checkoutForm.billingApartmentName,
                    postal_code: checkoutForm.billingPostalCode,
                    city_name: checkoutForm.billingCityName,
                    region_name: checkoutForm.billingRegionName,
                    phone_number: checkoutForm.billingPhoneNumber,
                  },
                });
              }
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
          
            // insert order_details
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
          
            return orderPurchased;
          }, { timeout: 15000 });
          
        
        // revalidate cache on the customer side
        revalidateTag("order-history");
        revalidateTag("billing");
        revalidateTag("shipping");

        // revalidate cache on the admin side
        revalidateTag("sales");
        revalidateTag("orders");

        return NextResponse.json(
        { successMessage: "Successfully inserted an order", actualData: result },
        { status: 200 }
        );
    } catch (err) {
        console.error("Checkout Error:", err);
        return NextResponse.json(
        { errorMessage: err instanceof Error ? err.message : String(err) },
        { status: 500 }
        );
    }
}