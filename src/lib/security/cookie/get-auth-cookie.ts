import { cookies } from "next/headers";

// get token from cookie
export const getAuthCookie = async () => {
    return (await cookies()).get("access_token")?.value;
}