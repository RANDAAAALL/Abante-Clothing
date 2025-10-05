"use client";
import FormsContent from "./form";
import { loginFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { loginSchema, loginFormType } from "@/lib/validations/auth-schema";
import { LoginsURL } from "@/lib/config";
import { useCartItems } from "@/lib/store/cart-items";
import useAddToCart from "@/hooks/useAddToCart";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";

export default function LoginFormContent(){
    const resetFormRef = useRef<(() => void) | null>(null);
    const { selectedItem} = useCartItems();
    const { mutate: addData } = useAddToCart();
    const  queryClient = useQueryClient();
    const router = useRouter();

    const handleLoginClick = async (formData: loginFormType) => {
        const res = await fetch(`${LoginsURL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(`${data.errorMessage || data.parsedErrors}`);
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
      
        // Clear guest cart in Zustand + sessionStorage
        selectedItem.forEach((_, index) => selectedItem.splice(0, selectedItem.length));
        sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
      
        // Refetch the cart so navbar shows correct qty
        router.refresh();
        queryClient.invalidateQueries({ queryKey: ["get-cart"] });
      };
      

    return (
        <FormsContent<typeof loginSchema>
        title="Welcome"
        fields={loginFields}
        schema={loginSchema}
        onSubmitAction={handleLoginClick}
        labelForm="Forgot Password?"
        buttonText="Sign In"
        footerDescription="Doesn't have an account?"
        footerHref="register"
        onResetRefAction={(reset) => (resetFormRef.current = reset)
        }/>
    );
}