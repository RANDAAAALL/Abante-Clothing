"use client";

import { RegisterFormType } from "@/lib/types/form-data-types";
import FormsContent from "./form";
import { registerFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";

export default function RegisterFormContent(){
    const resetFormRef = useRef<(() => void) | null>(null);

    const handleRegisterClick = (data: RegisterFormType) => {
        alert("Still in development");
        
        // reset the fields
        resetFormRef.current?.();
    }

    return (
        <FormsContent<RegisterFormType>
        title="Create your account"
        description="Step up your drip, Join the Abante Fam"
        fields={registerFields}
        onSubmit={handleRegisterClick}
        buttonText="Sign Up"
        footerDescription="Already have an account?"
        footerHref="login"
        onResetRef={(reset) => (resetFormRef.current = reset)}/>
    );
}