import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { isAuthenticatedUser } from "./verify-user";
import { redirect } from "next/navigation";
import { getAddressCached } from "@/lib/cache/get-address-cached";

export const getAddress = async () => {
    if(!await isAuthenticatedUser()) redirect("/login");
  
    const payload = await UserPayload();
    const user_ID = Number(payload.user_ID);
    if(!user_ID) redirect("/login");

    return getAddressCached(user_ID);
}