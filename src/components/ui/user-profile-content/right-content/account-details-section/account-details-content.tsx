import { Suspense } from "react";
import AccountDetailsServerData from "./account-details-server-data";
import EmailAndUsernameSkeleton from "@/components/ui/skeletons/email-and-username";

export default function AccountDetailsContent(){
    return (
        <div>
            <div className="text-center md:text-start">
             <span className="text-2xl font-medium">Account Details</span>
            </div>
            <div className="mt-4"><Suspense fallback={<EmailAndUsernameSkeleton />}><AccountDetailsServerData /></Suspense></div>
        </div>
    );
}