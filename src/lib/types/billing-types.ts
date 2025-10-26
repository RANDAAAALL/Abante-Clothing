import { BillingFieldsType } from "../validations/checkout-schema";

type BillingProps = {
    country: string;
    // order_purchased_date: string | Date;
    address_ID: number
} & BillingFieldsType

export type { BillingProps };