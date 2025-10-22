"use client"
import { CheckoutURL, OrderReceiptEmailURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { OrderReceiptDateFormatter } from "@/lib/helper/order-receipt-date-formatter";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import { PDFReceiptDataProps } from "@/lib/types/pdf-order-receipt-types";
import Image from "next/image";
import toast from "react-hot-toast";

export default function PaymayaTemplate(){
    const { isPaymayaTemplateLoading,
            setPaymayaTemplateLoading,
            setResetPaymayaTemplateLoading,
            isOpenPaymentTemplateModal,
            setClosePaymentTemplateModal,
            submittedFormCheckoutFormData,
            setOrderPurchasedNumberAndDate,
            setSuccessfullPay,
            itemsData,
            Payment,
            computeItems } = useCheckoutModal();
    const serviceFee = 20;

    if(!isOpenPaymentTemplateModal || Payment.paymentMethod !== "paymaya") return null;

    const handlePaymaya = () => {
        setPaymayaTemplateLoading();
        toast.promise(
            (async () => {

            const paymentResponse = await fetchWithCsrf(`${CheckoutURL}`, {
            method: "POST",
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

            const emailResponse = await fetchWithCsrf(`${OrderReceiptEmailURL}`, {
                method: "POST",
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
                // reset paymaya loading state
                // set successfull pay to true after toast.promise resolves and close the payment template modal
                // will use this to show ReceiptModal and reset the form
                setResetPaymayaTemplateLoading();
                setSuccessfullPay();
                setClosePaymentTemplateModal();
              });
    }
    return (
        <>
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
                <div className={`bg-card-white-background max-h-[70vh] sm:max-h-[95vh] overflow-y-auto dark:bg-card-black-background rounded-xl shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 text-center space-y-6 transition-all duration-300`}>
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
                                <span className="font-medium text-2xl">₱{computeItems?.overallPriceResult.toLocaleString("en-Ph")}.00</span>
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
                                <span className="font-regular text-sm">₱{computeItems?.overallPriceResult.toLocaleString("en-Ph")}.00</span>
                            </div>

                            <div className="flex justify-between mt-1">
                                <span className="font-thin text-xs">Service Fee</span>
                                <span className="font-regular text-sm">₱{serviceFee.toFixed(2)}</span>
                            </div>
                            <hr className="border-1 my-2.5 border-black"/>

                            <div className="flex justify-between mt-3">
                                <span className="font-thin text-xs">Total Amount</span>
                                <span className="font-regular text-sm">₱{(computeItems!.overallPriceResult + serviceFee).toLocaleString("en-Ph")}.00</span>
                            </div>
                        </div>

                        <button
                            disabled={isPaymayaTemplateLoading}
                            onClick={handlePaymaya}
                            className={`bg-[#50B16B] text-[#F2F3F4] rounded-md mt-10 py-3 text-sm font-regular
                             ${isPaymayaTemplateLoading ? "cursor-not-allowed" : "cursor-pointer"}`}>
                            {isPaymayaTemplateLoading ? "Processing..." : "Pay now"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}