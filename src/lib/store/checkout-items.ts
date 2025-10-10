import { create } from "zustand"
import { CheckoutFormType } from "../validations/checkout-schema";

type ComputeItemState = {
    subTotalPriceResult: number;
    overallQtyResult: number;
    overallPriceResult: number;
};

type PaymentAndSaveInfoState = {
    paymentMethod: string | null;
}

type CheckoutModalState = {
    isOpen: boolean;

    isCompleteOrderTrigger: boolean,
    computeItems: ComputeItemState;
    isSuccessfullPay: boolean;

    Payment: PaymentAndSaveInfoState;

    submittedFormCheckoutFormData: CheckoutFormType | null;

    isCompleteOrderTriggerLoading: boolean;
    isPaymentProcessingLoading: boolean,
}

type CheckoutModalActionState = {
    setOpenModal: () => void,
    setCloseModal: () => void,

    setCompleteOrderTrigger: () => void,
    setResetCompleteOrderTrigger: () => void

    setComputeItems: (computeItem: ComputeItemState) => void;
    setClearComputeItems: () => void;

    setSuccessfullPay: () => void;
    setResetSuccessfullPay: () => void;

    setPayment: (setPaymentAndSaveInfo: PaymentAndSaveInfoState) => void;
    setClearPayment: () => void;

    setSubmittedFormCheckoutFormData: (SubmittedFormCheckoutFormData: CheckoutFormType) => void;
    setCleaarSubmittedFormCheckoutFormData: () => void;

    setIsCompleteOrderTriggerLoading: () => void;
    setResetCompleteOrderTriggerLoading: () => void;

    setIsPaymentProcessingLoading: () => void;
    setResetPaymentProcessingLoading: () => void;
}

export const useCheckoutModal = create<CheckoutModalState & CheckoutModalActionState>((set) => ({
    isOpen: false,
    setOpenModal: () => set({ isOpen: true}),
    setCloseModal: () => set({ isOpen: false}),
    
    isCompleteOrderTrigger: false,
    setCompleteOrderTrigger: () => set({ isCompleteOrderTrigger: true }),
    setResetCompleteOrderTrigger: () => set({ isCompleteOrderTrigger: false }),
    
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

    isSuccessfullPay: false,
    setSuccessfullPay: () => set({ isSuccessfullPay: true }),
    setResetSuccessfullPay: () => set({ isSuccessfullPay: false }),

    Payment: {
        paymentMethod: null,
    },
    setPayment: (Payment) => set({ Payment }),
    setClearPayment: () => set({ Payment: {
        paymentMethod: null,
    }}),

    submittedFormCheckoutFormData: null,
    setSubmittedFormCheckoutFormData: (submittedFormCheckoutFormData) => set({ submittedFormCheckoutFormData }),
    setCleaarSubmittedFormCheckoutFormData: () => set({ submittedFormCheckoutFormData: null }),

    isCompleteOrderTriggerLoading: false,
    setIsCompleteOrderTriggerLoading: () => set({ isCompleteOrderTriggerLoading: true }),
    setResetCompleteOrderTriggerLoading: () => set({ isCompleteOrderTriggerLoading: false }),

    isPaymentProcessingLoading: false,
    setIsPaymentProcessingLoading: () => set({ isPaymentProcessingLoading: true }),
    setResetPaymentProcessingLoading: () => set({ isPaymentProcessingLoading: false }),
}));
