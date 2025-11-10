import { Suspense } from "react";
import CheckoutItemData from "./checkout-item-data";
import CheckoutServerData from "./checkout-server-data";
import CheckoutFormSkeleton from "../skeletons/checkout-form-card";

export default function CheckoutContent(){

  return (
      <>
        {/* title */}
        <div className="text-center mt-10"><span className="text-3xl font-bold">Checkout</span></div>

        {/* container */}
        <div className="grid grid-cols-1 md:gap-5 md:grid-cols-[1fr_1fr]">

        {/* left content */}
        <Suspense fallback={<CheckoutFormSkeleton />}><CheckoutServerData /></Suspense>
        
        {/* right content */}
        <div><CheckoutItemData /></div>
        </div>
      </>  
    );
}