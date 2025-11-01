import { getSales } from "@/dal/get-sales";
import SalesClientData from "./sales-client-data";

export default async function SalesServerData(){
    const salesData = await getSales();

    return <SalesClientData sales={salesData}/>
}