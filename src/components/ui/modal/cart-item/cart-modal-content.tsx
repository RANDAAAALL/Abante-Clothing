"use client"
import { useCartItemModal } from "@/lib/store/cart-items";
import NavbarCart from "../../navbar-section/navbar-cart";
import PreviousButtonSVG from "@/components/icons/svg/previous-button";
import CartModalData from "./cart-modal-data";
export default function CartModalContent(){
    const { CloseModal, isOpen } = useCartItemModal();

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
        <div className="bg-card-white-background dark:bg-card-black-background rounded-lg shadow-lg w-[600px] max-w-[90%] p-7 py-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1">
              <p className="font-medium text-xl">Cart</p>
              <NavbarCart flag={true}/>
            </div>
            <button
              className="text-black dark:text-white font-bold cursor-pointer"
              onClick={CloseModal}>
              <PreviousButtonSVG/>
            </button>
          </div>
          <CartModalData />
        </div>
      </div>
    );
}