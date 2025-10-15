import { getOrderHistory } from "@/data-access-layer/get-order-history";
import PaginatedTable from "@/components/table/paginated-table";

export default async function OrderHistoryServerData(){
    const payload = await getOrderHistory();
    await new Promise(res => setTimeout(res, 1000));

    if(!payload || payload.length === 0) {
        return <div className="flex items-center justify-center h-full">
            <p>Your order history is currently empty.</p>
        </div>
    }

    return <PaginatedTable TheadData={Object.keys(payload[0]) as (keyof typeof payload[0])[]} TbodyData={payload}/>
}
