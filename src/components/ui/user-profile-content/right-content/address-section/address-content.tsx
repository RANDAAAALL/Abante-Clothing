import { Suspense } from "react";
import React from "react";
import AddressServerData from "./address-server-data";

export default async function AddressContent(){
    return (
        <React.Fragment>
            <div className="text-center md:text-start">
                <span className="text-2xl font-medium">Delivery Address</span>
            </div>
            <Suspense fallback={<div className="flex items-center justify-center h-50 md:h-120"><p>Loading....</p></div>}>
                <AddressServerData />
            </Suspense>
        </React.Fragment>
    );
}