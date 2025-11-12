import { CheckoutFormType } from "../validations/checkout-schema";

type AddressProps = {
    address_ID: number;
    is_selected: boolean;
    hasActiveOrder: boolean;
} & Partial<CheckoutFormType>

export type { AddressProps };