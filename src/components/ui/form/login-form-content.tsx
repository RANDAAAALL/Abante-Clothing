"use client";
import FormsContent from "./form-content";
import { loginFields } from "@/lib/values-type/form-data-value";
import { useEffect, useRef, useState } from "react";
import { loginSchema, loginFormType } from "@/lib/validations/auth-schema";
import { LoginsURL } from "@/lib/config";
import { useCartItems } from "@/lib/store/cart-items";
import useAddToCart from "@/hooks/useAddToCart";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/store/auth";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";

export default function LoginFormContent({
  reason
}: {
  reason?: string
}) {
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
  
    queryClient.removeQueries();
    resetSelectedItem();
    sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
    const bc = new BroadcastChannel("auth");
    bc.postMessage({ type: "LOGOUT" });
    bc.close();
    setClearOrderHistoryReceiptData();
    setClearAuthUser();

    toast(
      reason === "expired"
        ? "Your session has expired. Please log in again."
        : reason === "invalid" 
        ? "Invalid authentication token. Please log in."
        : reason === "no-token"
        ? "Please log in to access this page."
        : "Authentication error. Please log in."
    , { duration: 5000 });
     
  }, [reason, queryClient, resetSelectedItem, setClearAuthUser, setClearOrderHistoryReceiptData]);


  const handleLoginClick = async (formData: loginFormType) => {
    // setLoading();
    setLoginLoading(true);
    try {
        const res = await fetch(`${LoginsURL}`, {
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

        // Merge guest cart items to server
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

      // clear cart items in zustand + sessionStorage
      resetSelectedItem();
      sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
      
      // smooth refresh for navbar/cart updates
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
      setAuthUser(data)
      router.push("/");
    }finally {
      
      // resetLoading();
      setLoginLoading(false);
    }
  };

  return (
    <>
      <FormsContent<typeof loginSchema>
        title="Welcome"
        fields={loginFields}
        schema={loginSchema}
        onSubmitAction={handleLoginClick}
        labelForm="Forgot Password?"
        buttonText="Sign in"
        footerDescription="Doesn't have an account?"
        footerHref="register"
        onResetRefAction={(reset) => (resetFormRef.current = reset)}
      />

      {/* overlay for smoother feel */}
      {loginLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-300">
          <div className="text-white text-lg animate-pulse">Logging in...</div>
        </div>
      )}
    </>
  );
}
