import { redirect } from "next/navigation";
import { isAuthenticatedUser } from "./verify-user";
import { getSalesCached } from "@/lib/cache/get-sales-cached";

export const getSales = async () => {
    if(!await isAuthenticatedUser()) redirect("/admin/login");
  
    return getSalesCached();
}