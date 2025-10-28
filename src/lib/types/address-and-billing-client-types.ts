import { AddressProps } from "./address-types";
import { BillingProps } from "./billing-types";

type AddressAndBillingClientDataProps<T extends BillingProps | AddressProps | { is_selected: boolean}> = {
    title: string;
    clientData: T[];
};

export type { AddressAndBillingClientDataProps };