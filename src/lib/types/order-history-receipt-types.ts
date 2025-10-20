import { CheckoutFormType } from "../validations/checkout-schema";

type ProductDetailProps = {
    name: string;
    image: string;
    qty: number | string;
    size: string;
    color: string;
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