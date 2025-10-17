import { redirect } from "next/navigation";
import { isAuthenticatedUser } from "./verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { getOrderHistoryCached } from "../lib/cache/get-order-history-cached";

export const getOrderHistory = async () => {
    if(!await isAuthenticatedUser()) redirect("/login");
  
    const payload = await UserPayload();
    const user_ID = Number(payload.user_ID);
    if(!user_ID) redirect("/login");

    return getOrderHistoryCached(user_ID);
}