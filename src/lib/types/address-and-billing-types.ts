import { AddressProps } from "./address-types";
import { BillingProps } from "./billing-types";

type AddressAndBillingClientDataProps<T extends BillingProps | AddressProps> = {
    title: string;
    clientData: T[];
};

export type { AddressAndBillingClientDataProps };