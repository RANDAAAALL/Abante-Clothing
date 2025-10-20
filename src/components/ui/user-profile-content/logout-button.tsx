"use client";
import { LogoutURL } from "@/lib/config";
import {  useCartItems } from "@/lib/store/cart-items";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const { setIsOpen } = useMenuBarStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { selectedItem, resetSelectedItem } = useCartItems();
  const {  setClearOrderHistoryReceiptData } = useOrderHistoryReceiptModal();

  const handleLogoutClick = async () => {
    setLoading(true);

    try {
      const res = await fetch(LogoutURL, { method: "POST", credentials: "include" });
      if (!res.ok) {
        toast.error("Logout failed");
        setLoading(false);
        return;
    }
        // clear caches, cart items in zustand + sessionStorage and notify other tabs
        queryClient.removeQueries();
        resetSelectedItem();
        sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
        const bc = new BroadcastChannel("auth");
        bc.postMessage({ type: "LOGOUT" });
        bc.close();
        setIsOpen(false);
        setClearOrderHistoryReceiptData();
        router.replace("/login");
    }catch (err) {
        console.error(err);
        toast.error("Something went wrong");
        setLoading(false);
    }finally {
        setLoading(false);
    }
  };

  return (
    <>
      <button

        onClick={handleLogoutClick}
        className="cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-lg py-3 px-4">
        Logout
      </button>

      {/* {isLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity duration-300">
          <div className="text-white text-lg animate-pulse">Logging out...</div>
        </div>
      )} */}
    </>
  );
}
