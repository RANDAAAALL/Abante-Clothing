"use client";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import GcashTemplate from "../../payment-templates/gcash";
import PaymayaTemplate from "../../payment-templates/paymaya";

export default function CheckoutModalContent() {
  const { 
        setCloseModal,
        isOpen,
        setCompleteOrderTrigger,
        isCompleteOrderTrigger,
        computeItems,
        Payment } = useCheckoutModal();

  // Only render when open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className={`bg-card-white-background dark:bg-card-black-background rounded-xl shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 text-center space-y-6 transition-all duration-300`}>

        {!isCompleteOrderTrigger ? (
          <>
            {/* Title */}
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Confirm Your Order
        </h2>

        {/* Message */}
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 hyphens-auto text-justify sm:text-center">
          Are you sure you want to complete this order? You won’t be able to make
          changes after this step.
        </p>

        {/* Buttons */}
        <div className="flex justify-center flex-col sm:flex-row gap-4 pt-4">
        
          <button onClick={() => {
            // setCloseModal()
            setCompleteOrderTrigger()
            // clearItems()
            // toast("Under Development....");
            }}
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
          {Payment.paymentMethod === "gcash" ? (
            <GcashTemplate overallPriceResult={computeItems.overallPriceResult} /> 
          ) : (
            <PaymayaTemplate overallPriceResult={computeItems.overallPriceResult} />
          )}
          </>
        )}
      </div>
    </div>
  );
}