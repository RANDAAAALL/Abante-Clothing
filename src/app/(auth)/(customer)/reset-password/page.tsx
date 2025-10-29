import ResetPasswordFormContent from "@/components/ui/form/reset-password-form-content";
import { ResetPasswordProps } from "@/lib/interface/reset-password";
import { redirect } from "next/navigation";

export default async function ResetPassword({ searchParams }: ResetPasswordProps) {
    const { token, success } = await searchParams;

    if(!token) redirect("/login");

    return <ResetPasswordFormContent resetPasswordToken={decodeURIComponent(token)} isSuccess={!!success}/>
}