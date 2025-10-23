"use client";
import { LogoutURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { useAuth } from "@/lib/store/auth";
import {  useCartItems } from "@/lib/store/cart-items";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LogoutButtonContent() {
  const { setIsOpen } = useMenuBarStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { resetSelectedItem } = useCartItems();
  const { setClearOrderHistoryReceiptData } = useOrderHistoryReceiptModal();
  const { setClearAuthUser, setLoading, resetLoading } = useAuth();

  const handleLogoutClick = async () => {
    setLoading();
    setIsOpen(false);
    
    try {
      const res = await fetchWithCsrf(LogoutURL, { method: "POST"});
      const data = await res.json();
      if (!res.ok) throw new Error(`${data?.errorMessage}` || "Logout failed");
      
      // clear caches, cart items in zustand + sessionStorage and notify other tabs
      queryClient.removeQueries();
      resetSelectedItem();
      sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
      const bc = new BroadcastChannel("auth");
      bc.postMessage({ type: "LOGOUT" });
      bc.close();
      setClearOrderHistoryReceiptData();
      setClearAuthUser();
      router.replace("/login");
    }catch (err) {
      toast.error(`${err}`);
      resetLoading();
    }finally {
      resetLoading();
    }
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className="cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-lg py-3 px-4">
        Logout
      </button>
    </>
  );
}

