import { CheckoutFormType } from "../validations/checkout-schema";

type ProductDetailProps = {
    order_detail_ID: number;
    order_purchased_ID: number;
    name: string;
    image: string;
    qty: number | string;
    size: string;
    color: string;
    price: number;
    feedback_comment: string;
    feedback_rating: number;
    returns?: {
      return_ID: number;
      order_detail_ID: number | null;
      is_returned: number | null;
      returned_product_name: string | null;
      returned_product_price: number | null;
      returned_product_color: string | null;
      returned_product_qty: number | null;
      returned_product_size: string | null;
      returned_product_image: string[] | null;
      returned_product_reason: string | null;
      request_return_date: Date | string | null;
      returned_date: Date | string | null;
      is_return_accepted: string | null;
    }[]
  };
  
  type OrderReceiptModalProps = {
    country: string;
    orderNumber: string;
    orderPurchasedDate: string | Date;
    productDetails: ProductDetailProps[];
    paymentMethod: string;
    addressType: "shipping-address" | "billing-address";
    totalAmount: number;
  } & Partial<CheckoutFormType>; 
  
export type { OrderReceiptModalProps };