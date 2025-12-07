import ResetPasswordFormContent from "@/components/ui/form/reset-password-form-content";
import { ResetPasswordProps } from "@/lib/interface/reset-password";
import { redirect } from "next/navigation";

export default async function ResetPassword({ searchParams }: ResetPasswordProps) {
    const { token, success } = await searchParams;

    if(!token) redirect("/login");

    return <ResetPasswordFormContent resetPasswordToken={decodeURIComponent(token)} isSuccess={!!success}/>
};

// import ResetPasswordFormContent from "@/components/ui/form/reset-password-form-content";
// import { ResetPasswordProps } from "@/lib/interface/reset-password";
// import { redirect } from "next/navigation";
// import { use, Suspense } from "react";

// function ResetPasswordContent({ searchParams }: ResetPasswordProps) {
//     const { token, success } = use(searchParams);

//     if (!token) redirect("/login");

//     return <ResetPasswordFormContent resetPasswordToken={decodeURIComponent(token)} isSuccess={!!success} />;
// }

// export default function ResetPassword({ searchParams }: ResetPasswordProps) {
//     return (
//         <Suspense fallback={
//             <div className="flex items-center justify-center h-screen">
//                 <div>Loading reset password...</div>
//             </div>
//         }>
//             <ResetPasswordContent searchParams={searchParams} />
//         </Suspense>
//     );
// }