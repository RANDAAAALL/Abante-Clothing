import { BillingFieldsType } from "../validations/checkout-schema";

type BillingProps = {
    country: string;
    address_ID: number;
    is_selected: boolean,
} & BillingFieldsType

export type { BillingProps };