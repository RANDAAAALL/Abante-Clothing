import { getAddress } from "@/dal/get-address";
import AddressAndBillingClientData from "../address-and-billing-client-data";

export default async function AddressServerData(){
    // await new Promise(res => setTimeout(res, 3000))
    const addressData = await getAddress();
    return <AddressAndBillingClientData  title="delivery address" clientData={addressData} />
} 