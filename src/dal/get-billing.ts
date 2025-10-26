import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { isAuthenticatedUser } from "./verify-user";
import { redirect } from "next/navigation";
import { getBillingCached } from "@/lib/cache/get-billing-cached";

export const getBilling = async () => {
    if(!await isAuthenticatedUser()) redirect("/login");
  
    const payload = await UserPayload();
    const user_ID = Number(payload.user_ID);
    if(!user_ID) redirect("/login");

    return getBillingCached(user_ID);
}