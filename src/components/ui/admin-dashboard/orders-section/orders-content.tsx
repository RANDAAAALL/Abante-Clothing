import { Suspense } from "react";
import OrdersServerData from "./orders-server-data";
import DashboardOrdersSkeleton from "../../skeletons/dashboard-orders-card";


export default function OrdersContent(){
    return (
        <main className="min-h-[500] md:min-h-screen w-full md:max-w-7xl md:mx-auto mt-10 p-4 md:p-0 md:px-6">
            <div> <span className="font-bold text-3xl">Current Orders</span></div>
            <Suspense fallback={<DashboardOrdersSkeleton />}><OrdersServerData /></Suspense>
        </main>
    );
}