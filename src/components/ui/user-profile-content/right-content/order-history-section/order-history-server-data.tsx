import PaginatedTable from "@/components/table/paginated-table";
import { getOrderHistory } from "@/dal/get-order-history";

export default async function OrderHistoryServerData(){
    const payload = await getOrderHistory()

    if(!payload || payload.length === 0) {
        return <div className="flex items-center justify-center h-full">
            <p>Your order history is currently empty.</p>
        </div>
    }

    return <PaginatedTable TheadData={Object.keys(payload[0]) as (keyof typeof payload[0])[]} TbodyData={payload}/>
}
