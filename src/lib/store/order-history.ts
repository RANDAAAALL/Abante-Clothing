import { create } from "zustand";
import { OrderReceiptModalProps } from "@/lib/types/order-history-receipt-types";

type OrderHistoryReceiptState = {
  isOpen: boolean;
  orderHistoryReceiptData: OrderReceiptModalProps[];
  orderPurchasedNumber: string | null;
};

type OrderHistoryReceiptActionState = {
  setOpenModal: () => void;
  setCloseModal: () => void;
  setOrderHistoryReceiptData: (data: OrderReceiptModalProps[]) => void;
  setClearOrderHistoryReceiptData: () => void;
  setOrderPurchasedNumber: (orderNumber: string) => void;
  setClearOrderPurchasedNumber: () => void;
};

export const useOrderHistoryReceiptModal = create<
  OrderHistoryReceiptState & OrderHistoryReceiptActionState
>((set) => ({
  isOpen: false,
  orderHistoryReceiptData: [],
  orderPurchasedNumber: null,

  setOpenModal: () => set({ isOpen: true }),
  setCloseModal: () => set({ isOpen: false }),

  setOrderHistoryReceiptData: (data) =>
    set((state) => {
      const newData = data.filter(
        (incomingOrder) =>
          !state.orderHistoryReceiptData.some(
            (existing) => existing.orderNumber === incomingOrder.orderNumber
          )
      );

      // merge without duplicates
      return {
        orderHistoryReceiptData: [
          ...state.orderHistoryReceiptData,
          ...newData,
        ],
      };
    }),

  setClearOrderHistoryReceiptData: () => set({ orderHistoryReceiptData: [] }),
  setOrderPurchasedNumber: (orderNumber) => set({ orderPurchasedNumber: orderNumber }),
  setClearOrderPurchasedNumber: () => set({ orderPurchasedNumber: null }),
}));
