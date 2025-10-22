import { jwtVerify } from "jose";

export const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Verify JWT token
export const VerifyAuthToken = async (token: string) => {
    return await jwtVerify(token, secret);
}