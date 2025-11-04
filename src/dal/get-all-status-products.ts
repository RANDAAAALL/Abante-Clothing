import { redirect } from "next/navigation";
import { isAuthenticatedUser } from "./verify-user";
import { getAllStatusProductsCached } from "@/lib/cache/get-all-status-products-cached";

export const getAllStatusProducts = async () => {
    if(!await isAuthenticatedUser()) redirect("/admin/login");
  
    return getAllStatusProductsCached();
}