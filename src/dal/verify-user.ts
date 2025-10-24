import { getSessionCookie } from "@/lib/security/cookie/get-session-cookie";
import { verifySessionToken } from "@/lib/security/jwt/verify-session-token";

// this will check if the user is authenticated
export const isAuthenticatedUser = async () => {
    const token = await getSessionCookie();
    if(!token) return false;

    try{
        await verifySessionToken(token);
        return true;
    }catch {
        return false;
    }
}