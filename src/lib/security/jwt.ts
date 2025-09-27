import { SignJWT, jwtVerify, JWTPayload } from "jose";

export const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Generate JWT token
export const GenerateAuthToken = async (payload: JWTPayload) => {
    return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })   // algorithm
    .setIssuedAt()                          // iat
    .setExpirationTime("15m")               // expires in 15 mins
    .sign(secret);
};

// Verify JWT token
export const VerifyAuthToken = async (token: string) => {
    return await jwtVerify(token, secret);
}



