"use client";

// import { RegisterFormType } from "@/lib/types/form-data-types";
import FormsContent from "./form";
import { registerFields } from "@/lib/values-type/form-data-value";
import { useRef } from "react";
import { registerationSchema, registerFormType } from "@/lib/validations/auth-schema";
import { RegisterURL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function RegisterFormContent(){
    const resetFormRef = useRef<(() => void) | null>(null);
    const router = useRouter();

    const handleRegisterClick = async (formData: registerFormType) => {
        const res = await fetch(`${RegisterURL}`, {
            method: "POST",
            headers: {"Content-Type": "application/json",},
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        
        if(!res.ok){
            toast(`${data.errorMessage || data.parsedErrors}`);
            return;
        }

        toast("Registered Successfully!");
        router.push("/login");
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