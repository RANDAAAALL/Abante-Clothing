import PaginatedTable from "@/components/table/paginated-table";
import { getOrderHistory } from "@/dal/get-order-history";

export default async function OrderHistoryServerData(){
    const { tableData, orderReceiptModalData } = await getOrderHistory()

    if(!tableData || !orderReceiptModalData  || tableData.length === 0 || !orderReceiptModalData) {
        return <div className="flex items-center justify-center h-full">
            <p>Your order history is currently empty.</p>
        </div>
    }

    return <PaginatedTable 
    TheadData={Object.keys(tableData[0]) as (keyof typeof tableData[0])[]}
    TbodyData={tableData}
    OrderReceiptModalData={orderReceiptModalData}/>
}
