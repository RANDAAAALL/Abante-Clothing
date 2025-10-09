import { create } from "zustand"

type ComputeItemState = {
    subTotalPriceResult: number;
    overallQtyResult: number;
    overallPriceResult: number;
};

type PaymentAndSaveInfoState = {
    paymentMethod: string | null;
    saveInformation: boolean | null;
}

type CheckoutModalState = {
    isOpen: boolean,

    isCompleteOrderTrigger: boolean,
    computeItems: ComputeItemState,
    isSuccessfullPay: boolean,

    PaymentAndSaveInfo: PaymentAndSaveInfoState
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

    setPaymentAndSaveInfo: (setPaymentAndSaveInfo: PaymentAndSaveInfoState) => void;
    setClearPaymentAndSaveInfo: () => void;
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

    PaymentAndSaveInfo: {
        paymentMethod: null,
        saveInformation: null
    },
    setPaymentAndSaveInfo: (PaymentAndSaveInfo) => set({ PaymentAndSaveInfo }),
    setClearPaymentAndSaveInfo: () => set({ PaymentAndSaveInfo: {
        paymentMethod: null,
        saveInformation: null
    }}),
}));
