import { LogoSVG } from "@/components/icons/svg/abante-clothing-logo";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import { CircleCheck } from "lucide-react";
import Image from "next/image";

export default function GcashTemplate({overallPriceResult}: {
    overallPriceResult: number
}){
    const { setSuccessfullPay, isPaymentProcessingLoading } = useCheckoutModal();
    return (
        <>
        {/* container */}
        <div className="flex flex-col space-y-0 bg-slate-200 rounded-sm">
            
            {/* title */}
            <div className="relative w-30 h-18 mx-auto rounded-t-sm">
                <Image src="/images/png/gcash-logo.png" fill alt="gcash-logo"/>
            </div>

            <div className="flex flex-col items-center space-y-2 bg-gcash-background w-full py-4">

                {/* logo */}
                <div className="bg-white rounded-full">
                    <LogoSVG className="w-[80] h-[80] stroke-6" style={{color: "black"}}/> 
                </div>

                {/* business name */}
                <span className="text-lg font-medium text-white">Abante Clothing</span>
            </div>

            {/* pay with container */}
            <span className="text-xs font-thin text-left mt-4 mb-2 px-3 text-black">PAY WITH</span>
            <div className="flex flex-col text-left space-y-2 bg-[#f2f2f2] p-4 text-black">

                <div className="flex justify-between items-center">
                    <span className="text-sm font-regular">GCash</span>

                    <div className="flex flex-col relative">
                        <span className="text-right text-sm font-regular">php5,000</span>
                        <span className="mr-5 text-[11px] font-thin">Available Balance</span>
                        <CircleCheck color="blue" className="absolute right-0 bottom-0.5" width={15} height={15}/>
                    </div>
                </div>        
            </div>

            {/* about to pay container */}
            <span className="text-xs font-thin text-left mt-4 mb-2 px-3 text-black">YOU ARE ABOUT TO PAY</span>
            <div className="flex flex-col text-left space-y-2 bg-[#f2f2f2] text-black p-4">

                <div className="flex justify-between text-sm font-regular">
                    <span>Amount Due</span>
                    <span>php{overallPriceResult.toLocaleString("en-Ph")}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="font-regular">Discount</span>
                    <span className="font-thin text-[11px] text-right">No available voucher</span>
                </div>

                <hr className="border-black border-t-1"/>
                
                
                <div className="flex justify-between text-md font-regular">
                    <span>Total Amount</span>
                    <span>php{overallPriceResult.toLocaleString("en-Ph")}.00</span>
                </div>
            </div>

            <div className="flex flex-col items-center mt-5 space-y-3 mb-5">
                <span className="text-center text-xs font-thin text-black">Please review to ensure that the details <br/>are correct before your proceed</span>
                <button 
                disabled={isPaymentProcessingLoading}
                onClick={setSuccessfullPay}
                className={`${isPaymentProcessingLoading ? "cursor-not-allowed" : "cursor-pointer" } bg-gcash-background text-white rounded-full px-12 md:px-13 py-2 font-regular`}>Pay php{overallPriceResult.toLocaleString("en-Ph")}.00</button>
            </div>
        </div>
        </>
    );
}