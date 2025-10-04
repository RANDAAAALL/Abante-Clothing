"use client";
import FormsContent from "./form";
import { loginFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { loginSchema, loginFormType } from "@/lib/validations/auth-schema";
import { LoginsURL } from "@/lib/config";
import { useCartItems } from "@/lib/store/cart-items";
import useAddToCart from "@/hooks/useAddToCart";
import { usePathname } from "next/navigation";

export default function LoginFormContent(){
    const resetFormRef = useRef<(() => void) | null>(null);
    const { selectedItem} = useCartItems();
    const { mutate: addData } = useAddToCart();
    const pathName = usePathname();


    const handleLoginClick = async (formData: loginFormType) => {
        const res = await fetch(`${LoginsURL}`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(formData),
        });
        
        const data = await res.json();
        if(!res.ok){
            alert(`${data.errorMessage || data.parsedErrors}`);
            return;
        }

        // passed an products argument on addData
        selectedItem.forEach((item) => {
            addData({
                product: item.product,
                selectedSizeAndQty: item.selectedSizeAndQty
            });
        });

        // remove all the items on the storage
        sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`)

        // full reload page
        window.location.href = pathName

        // reset the fields
        resetFormRef.current?.();
    }

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