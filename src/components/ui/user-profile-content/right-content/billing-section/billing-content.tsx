import { Suspense } from "react";
import BillingServerData from "./billing-server-data";
import React from "react";

export default async function BillingContent(){
    return (
        <React.Fragment>
            <div className="text-center md:text-start">
                <span className="text-2xl font-medium">Billing Address</span>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center h-50 md:h-120"><p>Loading....</p></div>}>
                <BillingServerData/>
            </Suspense>
        </React.Fragment>
    );
}