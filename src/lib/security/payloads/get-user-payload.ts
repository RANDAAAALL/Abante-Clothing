import { JWTPayload } from "jose";
import { VerifyAuthToken } from "../jwt";
import { redirect } from "next/navigation";
import { getAuthCookie } from "../cookies";

interface UserPayload extends JWTPayload {
    user_ID: string;
    username: string;
    email: string;
}

// retrieve user payload from token
export const UserPayload = async (): Promise<UserPayload> => {
    // reteive the token from the cookie
    // then checks if the token is valid
    const token = await getAuthCookie();
    if(!token) return redirect("/login");

    // extract the payload
    const { payload } = await VerifyAuthToken(token);

    return payload as UserPayload;
}
