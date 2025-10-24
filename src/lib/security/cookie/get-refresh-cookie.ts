import { cookies } from "next/headers";

// get refresh token from cookie
export const getRefreshCookie = async () => {
    return (await cookies()).get("refresh_token")?.value;
}