import { Suspense } from "react";
import BillingServerData from "./billing-server-data";
import React from "react";
import AddressAndBillingSkeleton from "@/components/ui/skeletons/address-and-biling-card";

export default async function BillingContent(){
    return (
        <React.Fragment>
            <div className="text-center md:text-start">
                <span className="text-2xl font-medium">Billing Address</span>
            </div>
            <Suspense fallback={<AddressAndBillingSkeleton />}>
                <BillingServerData/>
            </Suspense>
        </React.Fragment>
    );
}