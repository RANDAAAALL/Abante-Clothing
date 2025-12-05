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
  const { mutateAsync } = useAddToCart();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setClearAuthUser, setAuthUser } = useAuth();
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

    // toast("Your session has expired. Please log in again.",{ duration: 5000 });
    toast.error("Authentication required. Please log in.",{ duration: 5000 });
  }, [reason, user_type, queryClient, resetSelectedItem, setClearAuthUser, setClearOrderHistoryReceiptData]);
  
  const handleLoginClick = async (formData: loginFormType) => {
    setLoginLoading(true);
    try {
      const res = await fetch(`${LoginURL}/${user_type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(`${data.errorMessage || data.parsedErrors}` || "Login failed");
        setLoginLoading(false);
        return;
      }
  
      // set auth user first and wait for it to complete
      setAuthUser(data);
  
      // create a small delay to ensure auth state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      if (user_type === "user" && selectedItem.length > 0) {
        try {
          // console.log("Merging cart items:", selectedItem.length);

          const results = [];
          for (const item of selectedItem) {
            try {
              const result = await mutateAsync({
                product: item.product,
                selectedSizeQtyAndColor: item.selectedSizeQtyAndColor,
              });
              results.push(result);
              // console.log("Successfully added item:", item.product.product_item_ID);
              
              // small delay between mutations to prevent race conditions
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (itemError) {
              console.error("Failed to add item:", item.product.product_item_ID, itemError);
            }
          }
          
          // console.log("Cart merge completed:", results.length, "items merged");
          
          // clear local cart data
          resetSelectedItem();
          sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
          
          // refresh cart data
          await queryClient.invalidateQueries({ queryKey: ["get-cart"] });
          
        } catch (cartError) {
          // console.error("Cart merge failed:", cartError);
          toast.error("Failed to merge some cart items");
        }
      }
      // navigate after all operations -> whether cart merge happened or not
      router.replace(href_type);
  
    } catch (error) {
      // console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
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
