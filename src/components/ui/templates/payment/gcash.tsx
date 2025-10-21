"use client"
import { LogoSVG } from "@/components/icons/svg/abante-clothing-logo";
import { CheckoutURL, OrderReceiptEmailURL } from "@/lib/config";
import { OrderReceiptDateFormatter } from "@/lib/helper/order-receipt-date-formatter";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import { PDFReceiptDataProps } from "@/lib/types/pdf-order-receipt-types";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function GcashTemplate(){
    const { isGcashTemplateLoading,
            setGcashTemplateLoading,
            setResetGcashTemplateLoading,
            submittedFormCheckoutFormData,
            setClosePaymentTemplateModal,
            setOrderPurchasedNumberAndDate,
            isOpenPaymentTemplateModal,
            setSuccessfullPay,
            itemsData,
            Payment,
            computeItems} = useCheckoutModal();

    if(!isOpenPaymentTemplateModal || Payment.paymentMethod !== "gcash") return null;

    const handlePayGcash = () => {
        setGcashTemplateLoading();  
        toast.promise(
            (async () => {

                const paymentResponse = await fetch(`${CheckoutURL}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({submittedFormCheckoutFormData, itemsData, computeItems}),
                    });
        
                    const paymentResponseData = await paymentResponse.json();
                    if (!paymentResponse.ok) throw new Error(paymentResponseData?.errorMessage || "Something went wrong while processing your payment.");
            
                    const receiptData: PDFReceiptDataProps = {
                        orderNumber: paymentResponseData?.actualData?.order_purchased_number ?? "",
                        orderDate: paymentResponseData?.actualData?.order_purchased_date ?? "",
                        recipientFirstName: submittedFormCheckoutFormData?.recipientFirstName ?? "",
                        recipientLastName: submittedFormCheckoutFormData?.recipientLastName ?? "",
                        companyName: submittedFormCheckoutFormData?.companyName ?? "",
                        addressName: submittedFormCheckoutFormData?.addressName ?? "",
                        apartmentName: submittedFormCheckoutFormData?.apartmentName ?? "",
                        cityName: submittedFormCheckoutFormData?.cityName ?? "",
                        regionName: submittedFormCheckoutFormData?.regionName ?? "",
                        country: submittedFormCheckoutFormData?.country ?? "",
                        postalCode: submittedFormCheckoutFormData?.postalCode ?? "",
                        phoneNumber: submittedFormCheckoutFormData?.phoneNumber ?? "",
                        addressType: submittedFormCheckoutFormData?.addressType ?? "",
                        paymentMethod: submittedFormCheckoutFormData?.paymentMethod ?? "",
                        totalAmount: computeItems?.overallPriceResult ?? 0,
                        productDetails: itemsData?.map(item => ({
                          name: item.cart_item_name ?? "",
                          color: item.cart_item_color ?? "",
                          size: item.cart_item_size ?? "",
                          qty: Number(item.cart_item_qty),
                          image: item.cart_item_image ?? "",
                        })) ?? [],
                      };
        
                    const emailResponse = await fetch(`${OrderReceiptEmailURL}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(receiptData),
                    })
                    
                    // store resolve data
                    setOrderPurchasedNumberAndDate({
                        orderPurchasedNumber: paymentResponseData?.actualData?.order_purchased_number,
                        orderPurchasedDate: OrderReceiptDateFormatter(paymentResponseData?.actualData?.order_purchased_date),
                    });
                    
                    const emailResponseData = await emailResponse.json();
                    if (!emailResponse.ok) toast.error(`${emailResponseData?.errorMessage}`);
            })(),
            {
              loading: "Payment processing...",
            //success: "Payment successful! Your order is being processed.",
              success: "Paid successfully.",
              error: (e) => e?.message || "Payment failed",
            },
            { duration: 8000 }
          ).finally(() => {
              // reset gcash loading state
              // set successfull pay to true after toast.promise resolves and close the payment template modal
              // will use this to show ReceiptModal and reset the form
              setClosePaymentTemplateModal();
              setResetGcashTemplateLoading();
              setSuccessfullPay();
            });

    }

    return (
        <>
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
                <div className={`bg-card-white-background  max-h-[70vh] sm:max-h-[95vh] overflow-y-auto dark:bg-card-black-background rounded-xl shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 text-center space-y-6 transition-all duration-300`}>
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
                                <span>php{computeItems?.overallPriceResult.toLocaleString("en-Ph")}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="font-regular">Discount</span>
                                <span className="font-thin text-[11px] text-right">No available voucher</span>
                            </div>

                            <hr className="border-black border-t-1"/>
                            
                            
                            <div className="flex justify-between text-md font-regular">
                                <span>Total Amount</span>
                                <span>php{computeItems?.overallPriceResult.toLocaleString("en-Ph")}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center mt-5 space-y-3 mb-5">
                            <span className="text-center text-xs font-thin text-black">Please review to ensure that the details <br/>are correct before your proceed</span>
                            <button 
                                disabled={isGcashTemplateLoading}
                                onClick={handlePayGcash}
                                className={`${isGcashTemplateLoading ? "cursor-not-allowed" : "cursor-pointer"} bg-gcash-background text-white rounded-full px-12 md:px-13 py-2 font-regular`}>
                                {isGcashTemplateLoading 
                                ? "Processing..." 
                                : `Pay php${computeItems?.overallPriceResult.toLocaleString("en-Ph")}`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}