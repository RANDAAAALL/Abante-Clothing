import { getDefaultAddressOrBilling } from "@/dal/get-default-address-or-billing";
import CheckoutformContent from "../form/checkout-form-content";

export default async function CheckoutServerData(){
    const  parsedDefaultAddressAndBilling = await getDefaultAddressOrBilling();

    return <CheckoutformContent defaultAddressAndBilling={parsedDefaultAddressAndBilling} />
}