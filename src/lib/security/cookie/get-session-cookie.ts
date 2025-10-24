import { cookies } from "next/headers";

// get session token from cookie
export const getSessionCookie = async () => {
    return (await cookies()).get("session_token")?.value;
}