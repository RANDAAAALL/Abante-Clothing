"use client";
import FormsContent from "./form-content";
import { loginFields } from "@/lib/values-type/form-data-value";
import { useRef, useState } from "react";
import { loginSchema, loginFormType } from "@/lib/validations/auth-schema";
import { LoginsURL } from "@/lib/config";
import { useCartItems } from "@/lib/store/cart-items";
import useAddToCart from "@/hooks/useAddToCart";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginFormContent() {
  const resetFormRef = useRef<(() => void) | null>(null);
  const [isLoading, setLoading] = useState(false);
  const { selectedItem } = useCartItems();
  const { mutate: addData } = useAddToCart();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLoginClick = async (formData: loginFormType) => {
    setLoading(true);
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
            return;
          }

          // Merge guest cart items to server
          if (selectedItem.length > 0) {
            await Promise.all(
              selectedItem.map(item =>
                addData({
                  product: item.product,
                  selectedSizeAndQty: item.selectedSizeAndQty,
                })
              )
            );
          }

      // clear guest cart in Zustand + sessionStorage
      selectedItem.splice(0, selectedItem.length);
      sessionStorage.removeItem(`${process.env.STRG_NAME as string}`);
      
      // smooth refresh for navbar/cart updates
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
      router.push("/");
    }finally {
      // simulate loading delay
      await new Promise(res => setTimeout(res, 1000));
      setLoading(false);
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
        buttonText={isLoading ? "Signing in..." : "Sign In"}
        footerDescription="Doesn't have an account?"
        footerHref="register"
        onResetRefAction={(reset) => (resetFormRef.current = reset)}
      />

      {/* overlay for smoother feel */}
      {(isLoading) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-300">
          <div className="text-white text-lg animate-pulse">Logging in...</div>
        </div>
      )}
    </>
  );
}
