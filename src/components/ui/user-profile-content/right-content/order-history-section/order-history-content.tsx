import { Suspense } from "react"; 
import OrderHistoryServerData from "./order-history-server-data";

export default async function OrderHistoryContent(){
    return <Suspense fallback={
    <div className="flex items-center justify-center h-full">
        <p>Loading....</p>
    </div>
    }><OrderHistoryServerData/></Suspense>
}


