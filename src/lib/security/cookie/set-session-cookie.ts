import { cookies } from "next/headers";

// save session token in cookie
export const setSessionCookie = async (token: string) => {
    (await cookies()).set("session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // maxAge: 60, // expire in 1 min for testing purposes
        maxAge: 60 * 15, // expire in 15 minutes for testing purposes only
        // maxAge: 60 * 60 * 24, // expire in 1day
    })
}
