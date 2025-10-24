import { JWTPayload, SignJWT } from "jose";

// generate refresh token
export const generateRefreshToken = async (payload: JWTPayload) => {
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // algorithm
    .setIssuedAt() // iat
    // .setExpirationTime("1min") // expires in 1min for testing purposes only
    .setExpirationTime("15min") // expires in 15 mins for test purposes only
    // .setExpirationTime("1hr") // expires in 1hour
    .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));
};