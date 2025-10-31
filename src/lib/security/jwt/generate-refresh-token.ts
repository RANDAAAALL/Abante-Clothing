import { JWTPayload, SignJWT } from "jose";

// generate refresh token
export const generateRefreshToken = async (payload: JWTPayload) => {
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" }) // algorithm
    .setIssuedAt() // iat
    // .setExpirationTime("1min") // expires in 1min for testing purposes only
    // .setExpirationTime("3min") // expires in 3 mins for test purposes only
    // .setExpirationTime("1d") // expires in 1 day
    .setExpirationTime("7d") // expires in 7 days
    .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));
};