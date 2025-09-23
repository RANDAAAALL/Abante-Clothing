"use client";

// import { LoginFormType } from "@/lib/types/form-data-types";
import FormsContent from "./form";
import { loginFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { loginSchema, loginFormType } from "@/lib/validations/auth-schema";
import { LoginsURL } from "@/lib/config";

export default function LoginFormContent(){
    const resetFormRef = useRef<(() => void) | null>(null);

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

        alert(data.successMessage + " Still on development....");
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