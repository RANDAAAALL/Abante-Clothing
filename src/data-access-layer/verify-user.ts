import { getAuthCookie } from "@/lib/security/cookies"
import { VerifyAuthToken } from "@/lib/security/jwt";

// this will check if the user is authenticated
export const isAuthenticatedUser = async () => {
    const token = await getAuthCookie();
    if(!token) return false;

    try{
        await VerifyAuthToken(token);
        return true;
    }catch {
        return false;
    }
}