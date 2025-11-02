"use client";

// import { RegisterFormType } from "@/lib/types/form-data-types";
import FormsContent from "./form-content";
import { registerFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { registerationSchema, registerFormType } from "@/lib/validations/auth-schema";
import { RegisterURL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { NavbarButtonActionProps } from "@/lib/interface/navbar-action-button";

export default function RegisterFormContent({ user_type, href_type, footer_href_type }: NavbarButtonActionProps){
    const resetFormRef = useRef<(() => void) | null>(null);
    const router = useRouter();

    const handleRegisterClick = async (formData: registerFormType) => {
        return toast.promise(
            (async () => {
                const res = await fetch(`${RegisterURL}/${user_type}`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json",},
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if(!res.ok) throw new Error(`${data.errorMessage || data.parsedErrors}`);    
                
                return data;
            })(), {
                loading: "Signing up....",
                success: (message) => {
                    router.push(href_type);
                    // reset the fields
                    resetFormRef.current?.();
                    return message?.successMessage;
                },
                error: (e) => e.message || "Registered Unsucessfully. Please try again."
            }
        )
    }

    return (
        <FormsContent<typeof registerationSchema>
        title="Create your account"
        description="Step up your drip, Join the Abante Fam"
        fields={registerFields}
        schema={registerationSchema}
        onSubmitAction={handleRegisterClick}
        buttonText="Sign up"
        footerDescription="Already have an account?"
        footerHref={footer_href_type}
        onResetRefAction={(reset) => (resetFormRef.current = reset)}/>
    );
}