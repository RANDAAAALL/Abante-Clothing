import { create } from "zustand"
import { CheckoutFormType } from "../validations/checkout-schema";

export type ComputeItemState = {
    subTotalPriceResult: number;
    overallQtyResult: number;
    overallPriceResult: number;
};

type PaymentAndSaveInfoState = {
    paymentMethod: string | null;
}

type CheckoutModalState = {
    isOpenConfirmationModal: boolean;
    isSuccessfullPay: boolean;
    isOpenPaymentTemplateModal: boolean;
    isCompleteOrderTriggerLoading: boolean;
    isGcashTemplateLoading: boolean;
    isPaymayaTemplateLoading: boolean;
    computeItems: ComputeItemState;
    Payment: PaymentAndSaveInfoState;
    submittedFormCheckoutFormData: CheckoutFormType | null;
    itemsData: CartItemsProps[] | null;
}

type CheckoutModalActionState = {
    setOpenConfirmationModal: () => void,
    setCloseConfirmationModal: () => void,

    setComputeItems: (computeItem: ComputeItemState) => void;
    setClearComputeItems: () => void;
    
    setPayment: (setPaymentAndSaveInfo: PaymentAndSaveInfoState) => void;
    setClearPayment: () => void;
    
    setSubmittedFormCheckoutFormData: (SubmittedFormCheckoutFormData: CheckoutFormType) => void;
    setClearSubmittedFormCheckoutFormData: () => void;

    setOpenPaymentTemplateModal: () => void;
    setClosePaymentTemplateModal: () => void;

    setSuccessfullPay: () => void;
    setResetSuccessfullPay: () => void;
    
    setIsCompleteOrderTriggerLoading: () => void;
    setResetCompleteOrderTriggerLoading: () => void;

    setGcashTemplateLoading: () => void;
    setResetGcashTemplateLoading: () => void;

    setPaymayaTemplateLoading: () => void;
    setResetPaymayaTemplateLoading: () => void;

    setItemsData: (itemsData: CartItemsProps[]) => void;
    setClearItemsData: () => void; 
}

export const useCheckoutModal = create<CheckoutModalState & CheckoutModalActionState>((set) => ({
    isOpenConfirmationModal: false,
    setOpenConfirmationModal: () => set({ isOpenConfirmationModal: true}),
    setCloseConfirmationModal: () => set({ isOpenConfirmationModal: false}),

    computeItems: {
        subTotalPriceResult: 0,
        overallQtyResult: 0,
        overallPriceResult: 0,
    },
    setComputeItems: (computeItems) => set({ computeItems }),
    setClearComputeItems: () => set({ computeItems: {
        subTotalPriceResult: 0,
        overallQtyResult: 0,
        overallPriceResult: 0,
    } }),
    
    Payment: {
        paymentMethod: null,
    },
    setPayment: (Payment) => set({ Payment }),
    setClearPayment: () => set({ Payment: {
        paymentMethod: null,
    }}),
    
    submittedFormCheckoutFormData: null,
    setSubmittedFormCheckoutFormData: (submittedFormCheckoutFormData) => set({ submittedFormCheckoutFormData }),
    setClearSubmittedFormCheckoutFormData: () => set({ submittedFormCheckoutFormData: null }),

    isOpenPaymentTemplateModal: false,
    setOpenPaymentTemplateModal: () => set({ isOpenPaymentTemplateModal: true }),
    setClosePaymentTemplateModal: () => set({ isOpenPaymentTemplateModal: false }),
    
    isSuccessfullPay: false,
    setSuccessfullPay: () => set({ isSuccessfullPay: true }),
    setResetSuccessfullPay: () => set({ isSuccessfullPay: false }),

    isCompleteOrderTriggerLoading: false,
    setIsCompleteOrderTriggerLoading: () => set({ isCompleteOrderTriggerLoading: true }),
    setResetCompleteOrderTriggerLoading: () => set({ isCompleteOrderTriggerLoading: false }),

    isGcashTemplateLoading: false,
    setGcashTemplateLoading: () => set({ isGcashTemplateLoading: true }),
    setResetGcashTemplateLoading: () => set({ isGcashTemplateLoading: false }),

    isPaymayaTemplateLoading: false,
    setPaymayaTemplateLoading: () => set({ isPaymayaTemplateLoading: true }),
    setResetPaymayaTemplateLoading: () => set({ isPaymayaTemplateLoading: false }),

    itemsData: null,
    setItemsData: (itemsData) => set({ itemsData }),
    setClearItemsData: () => set({ itemsData: null }),
}));
