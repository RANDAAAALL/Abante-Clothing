"use client";

import { LoginFormType } from "@/lib/types/form-data-types";
import FormsContent from "./form";
import { loginFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { loginSchema } from "@/lib/data-access-layer/validations/auth-schema";

export default function LoginFormContent(){
    const resetFormRef = useRef<(() => void) | null>(null);

    const handleLoginClick = (data: LoginFormType) => {
        alert("Still in development");

        // reset the fields
        resetFormRef.current?.();
    }

    return (
        <FormsContent<typeof loginSchema>
        title="Welcome"
        fields={loginFields}
        schema={loginSchema}
        onSubmit={handleLoginClick}
        labelForm="Forgot Password?"
        buttonText="Sign In"
        footerDescription="Doesn't have an account?"
        footerHref="register"
        onResetRef={(reset) => (resetFormRef.current = reset)
        }/>
    );
}