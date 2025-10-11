"use client"
import ConfirmationModal from "./confirmation-modal";
import GcashTemplate from "../../templates/payment/gcash";
import PaymayaTemplate from "../../templates/payment/paymaya";
import OrderReceiptModal from "./order-receipt-modal";

export default function CheckoutModalContent() {

  return (
    <>
    <ConfirmationModal />     
    <GcashTemplate />
    <PaymayaTemplate />
    <OrderReceiptModal />
    </>
  );
}