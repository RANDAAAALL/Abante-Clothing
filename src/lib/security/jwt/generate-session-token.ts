import { SignJWT, jwtVerify, JWTPayload } from "jose";

// generate jwt token
export const generateSessionToken = async (payload: JWTPayload) => {
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // algorithm
    .setIssuedAt() // iat
    // .setExpirationTime("1min") // expires in 1min for testing purposes only
    .setExpirationTime("15min") // expires in 15 mins for testing purposes only
    // .setExpirationTime("1d") // expires in 1 day
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};