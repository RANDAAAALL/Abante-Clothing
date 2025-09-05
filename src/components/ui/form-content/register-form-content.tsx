"use client";

// import { RegisterFormType } from "@/lib/types/form-data-types";
import FormsContent from "./form";
import { registerFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { registerationSchema, registerFormType } from "@/lib/data-access-layer/validations/auth-schema";

export default function RegisterFormContent(){
    const resetFormRef = useRef<(() => void) | null>(null);

    const handleRegisterClick = (data: registerFormType) => {
        alert("Still in development");
        
        // reset the fields
        resetFormRef.current?.();
    }

    return (
        <FormsContent<typeof registerationSchema>
        title="Create your account"
        description="Step up your drip, Join the Abante Fam"
        fields={registerFields}
        schema={registerationSchema}
        onSubmitAction={handleRegisterClick}
        buttonText="Sign Up"
        footerDescription="Already have an account?"
        footerHref="login"
        onResetRefAction={(reset) => (resetFormRef.current = reset)}/>
    );
}