"use client"
import { ResetPasswordAPIURL } from "@/lib/config";
import { resetPasswordFormType, resetPasswordSchema } from "@/lib/validations/auth-schema";
import { useRef } from "react";
import toast from "react-hot-toast";
import FormsContent from "./form-content";
import { resetPasswordFields } from "@/lib/values-type/form-data-value";
import { useRouter } from "next/navigation";

export default function ResetPasswordFormContent({
    resetPasswordToken,
    isSuccess,
}: {
    resetPasswordToken: string
    isSuccess?: boolean
}) {
    const resetFormRef = useRef<(() => void) | null>(null);
    const router = useRouter();

    const handleResetPasswordClick = async (formData: resetPasswordFormType) => {
        try{
            const res = await fetch(`${ResetPasswordAPIURL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetPasswordToken, formData})
            });

            const data = await res.json();
            if(!res.ok) throw new Error(data?.errorMessage || data?.parsedErrors);

            router.replace(`/reset-password?token=${resetPasswordToken}&success=true`);
            toast.success(`${data?.successMessage}`);
        }catch(err: unknown){
            toast.error(`${err instanceof Error ? err.message : "Failed to reset password." }`)
        }
    }

    return (
        <>
            {!isSuccess ? ( 
                <FormsContent<typeof resetPasswordSchema>
                    title="Reset your password"    
                    fields={resetPasswordFields}
                    schema={resetPasswordSchema}
                    onSubmitAction={handleResetPasswordClick}
                    buttonText="Reset Password"
                    onResetRefAction={(reset) => (resetFormRef.current = reset)}/>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[500px] md:min-h-screen text-center">
                    <span className="text-4xl mb-4">✅</span>
                    <h1 className="text-2xl font-bold mb-2">Password Reset Successful!</h1>
                    <p className="text-gray-700 dark:text-gray-400 mb-6"> Your password has been updated. You can now log in with your new password. </p>
                </div>
            )}

        </>
    );
}