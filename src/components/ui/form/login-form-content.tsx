"use client";
import FormsContent from "./form-content";
import { loginFields } from "@/lib/values-type/form-data-value";
import { useEffect, useRef, useState } from "react";
import { loginSchema, loginFormType } from "@/lib/validations/auth-schema";
import { useCartItems } from "@/lib/store/cart-items";
import useAddToCart from "@/hooks/useAddToCart";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/store/auth";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import React from "react";
import { NavbarButtonActionProps } from "@/lib/interface/navbar-action-button";
import { LoginURL } from "@/lib/config";

export default function LoginFormContent({ user_type, href_type, footer_href_type, reason }: NavbarButtonActionProps) {
  const resetFormRef = useRef<(() => void) | null>(null);
  const { selectedItem, resetSelectedItem } = useCartItems();
  const { mutate: addData } = useAddToCart();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setClearAuthUser, setAuthUser, setLoading, resetLoading } = useAuth();
  const [ loginLoading, setLoginLoading ] = useState(false);
  const { setClearOrderHistoryReceiptData } = useOrderHistoryReceiptModal();
  
  useEffect(() => {
    if (!reason) return;
    
    if(user_type === "user"){
      queryClient.removeQueries();
      resetSelectedItem();
      sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
      setClearOrderHistoryReceiptData();
    }

    const bc = new BroadcastChannel("auth");
    bc.postMessage({ type: "LOGOUT" });
    bc.close();
    setClearAuthUser();

    toast("Your session has expired. Please log in again.",{ duration: 5000 });

  }, [reason, user_type, queryClient, resetSelectedItem, setClearAuthUser, setClearOrderHistoryReceiptData]);


  const handleLoginClick = async (formData: loginFormType) => {
    // setLoading();
    setLoginLoading(true);
    try {
        const res = await fetch(`${LoginURL}/${user_type}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(`${data.errorMessage || data.parsedErrors}` || "Login failed", {
            className: "z-[999999]"
          });
          // resetLoading();
          setLoginLoading(false);
          return;
        }

        if (user_type === "user") {
          if (selectedItem.length > 0) {
            await Promise.all(
              selectedItem.map(item =>
                addData({
                  product: item.product,
                  selectedSizeQtyAndColor: item.selectedSizeQtyAndColor,
                })
              )
            );
          }
        
          // allow cookie to settle
          await new Promise((r) => setTimeout(r, 300));
        
          resetSelectedItem();
          sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
        
          setAuthUser(data);
          router.push(href_type);
        
          // revalidate after redirect
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["get-cart"] });
            queryClient.refetchQueries({ queryKey: ["get-cart"] });
          }, 500);
        }        
    }finally {
      // resetLoading();
      setLoginLoading(false);
    }
  };

  return (
    <React.Fragment>
      <FormsContent<typeof loginSchema>
        title={user_type === "admin" ? "Welcome to Admin" : "Welcome"}
        fields={loginFields}
        schema={loginSchema}
        onSubmitAction={handleLoginClick}
        labelForm={`${user_type === "admin" ? "" : "Forgot Password?"}`}
        buttonText="Sign in"
        footerDescription={`${user_type === "admin" ? "" : "Doesn't have an account?"}`}
        footerHref={`${user_type === "admin" ? "" : footer_href_type}`}
        onResetRefAction={(reset) => (resetFormRef.current = reset)}
      />

      {/* overlay for smoother feel */}
      {loginLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-300">
          <div className="text-white text-lg animate-pulse">Logging in...</div>
        </div>
      )}
    </React.Fragment>
  );
}
