"use client";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import GcashTemplate from "../../templates/payment/gcash";
import PaymayaTemplate from "../../templates/payment/paymaya";
import OrderReceiptModal from "./order-receipt";

export default function CheckoutModalContent() {
  const { 
        setCloseModal,
        isOpen,
        setCompleteOrderTrigger,
        isCompleteOrderTrigger,
        computeItems,
        isSuccessfullPay,
        isCompleteOrderTriggerLoading,
        setResetCompleteOrderTriggerLoading,
        setIsCompleteOrderTriggerLoading,
        isPaymentProcessingLoading,
        Payment } = useCheckoutModal();

  // Only render when open
  if (!isOpen) return null;

  const handleClickCompleteOrderTrigger = async () => {
    setCompleteOrderTrigger();
    setIsCompleteOrderTriggerLoading();
    await new Promise(res => setTimeout(res, 3000));
    setResetCompleteOrderTriggerLoading();
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className={`bg-card-white-background max-h-[95vh] overflow-y-auto dark:bg-card-black-background rounded-xl shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 text-center space-y-6 transition-all duration-300`}>

        {!isCompleteOrderTrigger ? (
          <>
            {/* title */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Confirm Your Order
        </h2>

        {/* message */}
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 hyphens-auto text-justify sm:text-center">
          Are you sure you want to complete this order? You won’t be able to make
          changes after this step.
        </p>

        {/* buttons */}
        <div className="flex justify-center flex-col sm:flex-row gap-4 pt-4">
        
          <button 
            disabled={isCompleteOrderTriggerLoading}
            onClick={handleClickCompleteOrderTrigger}
            className="cursor-pointer px-5 py-2 rounded-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black hover:opacity-90 transition-all">
            Yes, Complete Order
          </button>
        
          <button onClick={setCloseModal}
            className="cursor-pointer px-5 py-2 rounded-md border border-gray-400 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            Cancel
          </button>
        </div>
          </>
        ) : (
          <>
          { !isSuccessfullPay ? (
            <>
              { isCompleteOrderTriggerLoading 
              ? <div className="h-[85vh] flex items-center justify-center"><span>Loading....</span></div> 
              : <> 
                {Payment.paymentMethod === "gcash" 
                ? <GcashTemplate overallPriceResult={computeItems.overallPriceResult} /> 
                : <PaymayaTemplate overallPriceResult={computeItems.overallPriceResult} />
                }
              </>
              }
            </>
          ) : (
            <> 
              { isPaymentProcessingLoading 
              ? <GcashTemplate overallPriceResult={computeItems.overallPriceResult} /> 
              : <OrderReceiptModal /> }
            </>
          )}
          </>
        )}
      </div>
    </div>
  );
}