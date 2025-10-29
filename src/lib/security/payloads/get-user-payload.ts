import { getSessionCookie } from "../cookie/get-session-cookie";
import { verifySessionToken } from "../jwt/verify-session-token";
import { UserPayloadProps } from "@/lib/interface/user-payload";

// retrieve user payload from token
export const UserPayload = async (): Promise<UserPayloadProps> => {
    // reteive the token from the cookie
    // then checks if the token is valid
    const sessionToken = await getSessionCookie();

    // extract the payload
    const { payload } = await verifySessionToken(sessionToken!);

    return payload as UserPayloadProps;
}
