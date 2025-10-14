import { getOrderHistory } from "@/data-access-layer/get-order-history";
import PaginatedTable from "@/components/table/paginated-table";

export default async function OrderHistoryServerData(){
    const payload = await getOrderHistory();
    await new Promise(res => setTimeout(res, 1000));
    return <PaginatedTable TheadData={Object.keys(payload[0])} TbodyData={payload}/>
}
