import { jwtVerify } from "jose";

// Verify JWT token
export const verifySessionToken = async (token: string) => {
    return await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
}