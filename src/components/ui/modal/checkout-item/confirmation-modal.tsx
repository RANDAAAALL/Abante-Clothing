"use client"
import { useCheckoutModal } from "@/lib/store/checkout-items";

export default function ConfirmationModal(){
    const { 
        setCloseConfirmationModal,
        isOpenConfirmationModal,
        isCompleteOrderTriggerLoading,
        setIsCompleteOrderTriggerLoading,
        setResetCompleteOrderTriggerLoading,
        setOpenPaymentTemplateModal } = useCheckoutModal();

  // Only render when its open
  if (!isOpenConfirmationModal) return null;

  const handleClickConfirmedCompleteOrder = async () => {
    // loading state
    setIsCompleteOrderTriggerLoading();
    
    // simulate loading
    await new Promise(res => setTimeout(res, 3000));

    // close the confirmation modal first
    setCloseConfirmationModal();
    
    // then open the payment template modal
    setOpenPaymentTemplateModal(); 
    
    // then resets the loading state
    setResetCompleteOrderTriggerLoading();
  }
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className={`bg-card-white-background  max-h-[70vh] sm:max-h-[95vh] overflow-y-auto dark:bg-card-black-background rounded-xl shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 text-center space-y-6 transition-all duration-300`}>
        
        {isCompleteOrderTriggerLoading
        ? <div>Loading....</div>
        : <> 
            {/* title */}
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">Confirm Your Order</h2>

            {/* message */}
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 hyphens-auto text-justify sm:text-center">
              Are you sure you want to complete this order? You won’t be able to make
              changes after this step.
            </p>

            {/* button container */}
            <div className="flex justify-center flex-col sm:flex-row gap-4 pt-4">

              <button 
                onClick={handleClickConfirmedCompleteOrder}
                className="cursor-pointer px-5 py-2 rounded-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black hover:opacity-90 transition-all">
                Yes, Complete Order
              </button>

              <button onClick={setCloseConfirmationModal}
                className="cursor-pointer px-5 py-2 rounded-md border border-gray-400 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                Cancel
              </button>
            </div>
          </>
        }
      </div>
    </div>
  )
}