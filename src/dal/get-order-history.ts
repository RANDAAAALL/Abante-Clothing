import { redirect } from "next/navigation";
import { isAuthenticatedUser } from "./verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { getOrderHistoryCached } from "../lib/cache/get-order-history-cached";

export const getOrderHistory = async () => {
    if(!await isAuthenticatedUser()) redirect("/login");
    
    const payload = UserPayload();

    return getOrderHistoryCached(Number((await payload).user_ID));
}