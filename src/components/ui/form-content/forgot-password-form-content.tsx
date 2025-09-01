"use client";

import { ForgotPasswordFormType } from "@/lib/types/form-data-types";
import FormsContent from "./form";
import { forgotPasswordFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { forgotPasswordSchema } from "@/lib/data-access-layer/validations/auth-schema";

export default function ForgotPasswordContent(){
    const resetFormRef = useRef<(() => void) | null>(null);

    const handleForgotPasswordClick = (data: ForgotPasswordFormType) => {
        alert("Still in development");

        // reset the fields
        resetFormRef.current?.();
    }

    return (    
        <FormsContent<typeof forgotPasswordSchema>
        title="Forgot Password"
        schema={forgotPasswordSchema}
        description="We will send you an email link to reset your password"
        fields={forgotPasswordFields}
        onSubmit={handleForgotPasswordClick}
        buttonText="Submit"
        labelForm="Check your email"
        onResetRef={(reset) => (resetFormRef.current = reset)}/>
    );
}