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


// import LoginFormContent from "@/components/ui/form/login-form-content";
// import { use, Suspense } from "react";

// function AdminLoginContent({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
//     const { reason } = use(searchParams);
    
//     return (
//         <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
//             <main className="text-center p-4 md:p-0 md:px-6">
//                 <LoginFormContent 
//                     user_type="admin"
//                     href_type="/admin/dashboard"
//                     footer_href_type="admin/register"
//                     reason={reason} 
//                 />
//             </main>
//         </div>
//     );
// }

// export default function AdminLogin({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
//     return (
//         <Suspense fallback={
//             <div className="flex items-center justify-center h-screen">
//                 <div>Loading login...</div>
//             </div>
//         }>
//             <AdminLoginContent searchParams={searchParams} />
//         </Suspense>
//     );
// }