"use client";
import FormsContent from "./form-content";
import { forgotPasswordFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { forgotPasswordSchema, forgotPasswordFormType } from "@/lib/validations/auth-schema";
import { ForgotPasswordURL } from "@/lib/config";
import toast from "react-hot-toast";

export default function ForgotPasswordContent(){
    const resetFormRef = useRef<(() => void) | null>(null);

    const handleForgotPasswordClick = async (formData: forgotPasswordFormType) => {
       try{
           const res = await fetch(`${ForgotPasswordURL}`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(formData)
           });
           const data = await res.json();
           if(!res.ok) throw new Error(data?.errorMessage || data?.parsedErrors);

           toast.success(`${data?.successMessage}`);
       }catch(err: unknown){
            toast.error(`${err instanceof Error ? err.message : "Failed to send reset password link." }`)
       }
    }

    return (    
        <FormsContent<typeof forgotPasswordSchema>
        title="Forgot Password"
        schema={forgotPasswordSchema}
        description="We will send you an email link to reset your password"
        fields={forgotPasswordFields}
        onSubmitAction={handleForgotPasswordClick}
        buttonText="Submit"
        onResetRefAction={(reset) => (resetFormRef.current = reset)}/>
    );
}