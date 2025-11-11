import { Suspense } from "react";
import AccountDetailsServerData from "./account-details-server-data";
import EmailAndUsernameSkeleton from "@/components/ui/skeletons/account-details-card";

export default function AccountDetailsContent(){
    return (
        <div className="mt-4"><Suspense fallback={<EmailAndUsernameSkeleton />}><AccountDetailsServerData /></Suspense></div>
    );
}