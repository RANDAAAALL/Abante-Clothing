import { create } from "zustand";
import { AddressAndBillingType } from "../validations/address-and-billing-schema";

type AddAndBillingState = {
    isOpen: boolean;
    title: string | null;
    action: string | null;
    address_ID: number | null;
    selectedFormData: (AddressAndBillingType & { address_ID?: number}) | null
}

type AddAndBillingActionState = {
    setOpen: () => void;
    setClose: () => void;
    
    setTitle: (title: string) => void;
    setResetTitle: () => void;

    setAction: (action: string) => void;
    setResetAction: () => void;

    setAddressID: (address_ID: number) => void;
    setClearAddressID: () => void;

    setSelectFormData: (formData: AddressAndBillingType & { address_ID: number}) => void;
    setClearSelectedFormData: () => void;
}

export const useAddressAndBillingModal = create<AddAndBillingState & AddAndBillingActionState>((set) => ({
    isOpen: false,
    setOpen: () => set({ isOpen: true }),
    setClose: () => set({ isOpen: false }),

    title: null,
    setTitle: (title) => set({ title }),
    setResetTitle: () => set({ title: null }),

    action: null,
    setAction: (action) => set({ action }),
    setResetAction: () => set({ action: null }),

    address_ID: null,
    setAddressID: (address_ID) => set({ address_ID }),
    setClearAddressID: () => set({ address_ID: null }),   
    
    selectedFormData: null,
    setSelectFormData: (formData) => set({ selectedFormData: formData }),
    setClearSelectedFormData: () => set({ selectedFormData: null }),
}));


