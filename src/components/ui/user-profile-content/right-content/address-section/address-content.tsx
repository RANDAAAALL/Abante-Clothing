import { Suspense } from "react";
import React from "react";
import AddressServerData from "./address-server-data";
import AddressAndBillingSkeleton from "@/components/ui/skeletons/address-and-biling-card";

export default async function AddressContent(){
    return (
        <React.Fragment>
            <div className="text-center md:text-start">
                <span className="text-2xl font-medium">Delivery Address</span>
            </div>
            <Suspense fallback={<AddressAndBillingSkeleton />}>
                <AddressServerData />
            </Suspense>
        </React.Fragment>
    );
}