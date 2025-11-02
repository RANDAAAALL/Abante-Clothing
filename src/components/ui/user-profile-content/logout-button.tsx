"use client";
import { LogoutURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { NavbarButtonActionProps } from "@/lib/interface/navbar-action-button";
import { useAuth } from "@/lib/store/auth";
import {  useCartItems } from "@/lib/store/cart-items";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function LogoutButtonContent({ user_type, href_type }: NavbarButtonActionProps) {
  const { setIsOpen } = useMenuBarStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { resetSelectedItem } = useCartItems();
  const { setClearOrderHistoryReceiptData } = useOrderHistoryReceiptModal();
  const { setClearAuthUser, setLoading, resetLoading } = useAuth();
  // const [ logoutLoading, setLogoutLoading ] = useState(false);
  // console.log("Current LogoutLoading State: ", logoutLoading)

  const handleLogoutClick = async () => {
    // setLogoutLoading(true);
    setLoading();
    setIsOpen(false);
    
    try {
      const res = await fetchWithCsrf(`${LogoutURL}/${user_type}`, { method: "POST"});
      const data = await res.json();
      if (!res.ok) throw new Error(`${data?.errorMessage}` || "Logout failed");
      
      // clear caches, cart items in zustand + sessionStorage and notify other tabs
      if(user_type === "user") {
        queryClient.removeQueries();
        resetSelectedItem();
        sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
        setClearOrderHistoryReceiptData();
      }
      
      const bc = new BroadcastChannel("auth");
      bc.postMessage({ type: "LOGOUT" });
      bc.close();
      setClearAuthUser();
      await new Promise((res) => setTimeout(res, 100)); 
      router.replace(href_type);
    }catch (err) {
      toast.error(`${err}`);
      resetLoading();
    }finally {
      resetLoading();
      // setLogoutLoading(false);
    }
  };

  return (
    <React.Fragment>
      <button
      onClick={handleLogoutClick}
      className="cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-lg py-3 px-4">
      Logout
      </button>

      {/* overlay for smoother feel */}
      {/* {logoutLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-300">
          <div className="text-white text-lg animate-pulse">Logging out...</div>
        </div>
      )} */}
    </React.Fragment>
  );
}

