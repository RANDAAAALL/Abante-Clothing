"use client";
import { useAddressAndBillingModal } from "@/lib/store/address-and-billing";
import AddressAndBillingFormContent from "../../form/address-and-billing-form";

export default function AddressAndBillingContentModal() {
  const { isOpen, setClose, title, setResetAction, setResetTitle, action } = useAddressAndBillingModal();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
      <div className="bg-card-white-background relative max-h-[90vh] overflow-y-auto dark:bg-card-black-background rounded-sm shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 space-y-6 transition-all duration-300">
        <span className="text-xl font-medium">{title}</span>
        <AddressAndBillingFormContent />
      </div>
    </div>
  );
}
