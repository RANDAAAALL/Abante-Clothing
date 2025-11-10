import PaginateOrderHistoryCards from "@/components/table/paginated-order-history-cards";
import { getOrderHistory } from "@/dal/get-order-history";

export default async function OrderHistoryServerData(){
    const { tableData, orderReceiptModalData } = await getOrderHistory()
    
    if(!tableData || !orderReceiptModalData  || tableData.length === 0 || !orderReceiptModalData) {
        return <div className="flex items-center justify-center h-full">
            <p>Your order history is currently empty.</p>
        </div>
    }

    return <PaginateOrderHistoryCards 
    TheadData={Object.keys(tableData[0]) as (keyof typeof tableData[0])[]}
    TbodyData={tableData}
    OrderReceiptModalData={orderReceiptModalData}/>
}