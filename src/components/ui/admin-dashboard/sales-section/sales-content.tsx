import { Suspense } from "react";
import SalesServerData from "./sales-server-data";
import DashboardSalesSkeleton from "../../skeletons/dashboard-sales-card";

export default function SalesContent(){
    return (
        <main className="min-h-[500] md:min-h-screen w-full md:max-w-7xl md:mx-auto mt-10 p-4 md:p-0 md:px-6">
          <div className="flex flex-col items-start">
            <span className="font-bold text-3xl">Sales</span>
            <span className="text-lg text-muted-foreground">current sales performance</span>    
          </div>

          <Suspense fallback={<DashboardSalesSkeleton />}><SalesServerData /></Suspense>
      </main>
    );
}