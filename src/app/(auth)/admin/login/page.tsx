import LoginFormContent from "@/components/ui/form/login-form-content";
import { use } from "react";

export default function AdminLogin({ searchParams }: { searchParams: Promise<{ reason?: string }> }){
    const { reason } = use(searchParams);

    return (
        <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
            <main className="text-center p-4 md:p-0 md:px-6">
            <LoginFormContent 
            user_type="admin"
            href_type="/admin/dashboard"
            footer_href_type="admin/register"
            reason={reason} />
            </main>
        </div>
    );
}