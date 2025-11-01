import { isAuthenticatedUser } from "./verify-user";
import { redirect } from "next/navigation";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { getUserInfoCached } from "../lib/cache/get-user-info-cached";
import { UserInfoProps } from "@/lib/types/user-info-types";

export const getUserInfo = async (): Promise<UserInfoProps> => {
    if(!await isAuthenticatedUser()) redirect("/login");
    
    const payload = await UserPayload();
    const user_ID = Number(payload.user_ID);
    if(!user_ID) redirect("/login");
    
    return await getUserInfoCached(user_ID);
};