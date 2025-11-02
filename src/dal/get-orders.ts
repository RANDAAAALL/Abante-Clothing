
import { redirect } from "next/navigation";
import { isAuthenticatedUser } from "./verify-user";
import { getOrdersCached } from "@/lib/cache/get-orders-cached";

export const getOrders = async () => {
    if(!await isAuthenticatedUser()) redirect("/login");
  
    return getOrdersCached();
}