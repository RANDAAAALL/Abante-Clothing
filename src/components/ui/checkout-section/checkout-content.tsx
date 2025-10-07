import CheckoutformContent from "../form/checkout-form-content";
import CheckoutServerData from "./checkout-item-data";

export default function CheckoutContent(){
  return (
      <>
        
        {/* title */}
        <div className="text-center mt-10"><span className="text-3xl font-bold">Checkout</span></div>

        {/* container */}
        <div className="grid grid-cols-1 md:gap-5 md:grid-cols-[1fr_1fr]">

        {/* left content */}
        <div><CheckoutformContent /></div>

        {/* right content */}
        <div><CheckoutServerData /></div>
        </div>
      </>  
    );
}