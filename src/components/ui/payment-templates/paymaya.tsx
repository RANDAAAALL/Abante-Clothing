import { useCheckoutModal } from "@/lib/store/checkout-items";
import Image from "next/image";


export default function PaymayaTemplate({overallPriceResult}: {
    overallPriceResult: number
}){
    const { setSuccessfullPay } = useCheckoutModal();
    const serviceFee = 20;
    return (
        <>
            {/* container */}
            <div className="flex flex-col p-4 sm:p-0">
                <div className="relative w-18 h-8 mx-auto mb-4">
                    <Image src="/images/png/paymaya-logo.png" fill alt="payamya-logo"/>
                </div>
                <hr className="border-1"/>

                {/* sub container */}
                <div className="py-8">
                    <span className="font-medium">Confirm Payment</span>
                    <div className="flex flex-col mt-6 space-y-1">
                        <span className="font-regular text-sm text-gray-600 dark:text-gray-400">Abante Clothing</span>
                        <span className="font-medium text-2xl">₱{overallPriceResult.toLocaleString("en-Ph")}.00</span>
                    </div>
                </div>

                {/* sub container */}
                <div className="bg-[#f2f2f2] rounded-md p-4 w-full text-black">
                    <div className="flex justify-between">
                        <span className="font-thin text-xs">Pay using</span>
                        <span className="font-regular text-sm">Maya Cash</span>
                    </div>

                    <div className="flex justify-between mt-4">
                        <span className="font-thin text-xs">Payment amount</span>
                        <span className="font-regular text-sm">₱{overallPriceResult.toLocaleString("en-Ph")}.00</span>
                    </div>

                    <div className="flex justify-between mt-1">
                        <span className="font-thin text-xs">Service Fee</span>
                        <span className="font-regular text-sm">₱{serviceFee.toFixed(2)}</span>
                    </div>
                    <hr className="border-1 my-2.5 border-black"/>

                    <div className="flex justify-between mt-3">
                        <span className="font-thin text-xs">Total Amount</span>
                        <span className="font-regular text-sm">₱{(overallPriceResult + serviceFee).toLocaleString("en-Ph")}.00</span>
                    </div>
                </div>

                <button 
                onClick={setSuccessfullPay}
                className="bg-[#50B16B] text-[#F2F3F4] rounded-md mt-10 py-3 cursor-pointer text-sm font-regular">Pay now</button>
            </div>
        </>
    );
}