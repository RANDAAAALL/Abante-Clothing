import { getBilling } from "@/dal/get-billing";
import AddressAndBillingClientData from "../address-and-billing-client-data";

export default async function BillingServerData(){
    // await new Promise(res => setTimeout(res, 3000))
    const billingData = await getBilling();
    return <AddressAndBillingClientData title="billing address" clientData={billingData} />
} 