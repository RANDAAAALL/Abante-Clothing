import { Suspense } from "react"; 
import OrderHistoryServerData from "./order-history-server-data";
import OrderHistorySkeleton from "@/components/ui/skeletons/order-history-card";

export default async function OrderHistoryContent(){
    return ( 
        <Suspense fallback={
        <OrderHistorySkeleton / >
        }><OrderHistoryServerData/></Suspense>
    )
    
}


