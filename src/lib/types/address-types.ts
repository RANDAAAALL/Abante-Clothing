import { CheckoutFormType } from "../validations/checkout-schema";

type AddressProps = {
    address_ID: number
} & Partial<CheckoutFormType>

export type { AddressProps };