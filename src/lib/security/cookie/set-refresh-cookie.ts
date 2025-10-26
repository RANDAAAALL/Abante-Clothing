import { cookies } from "next/headers";

// save refresh token in cookie
export const setRefreshCookie = async (token: string) => {
    (await cookies()).set("refresh_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // maxAge: 60 * 2, // expire in 2 min for testing purposes only
        maxAge: 60 * 15, // expire in 15 minutes for testing purposes only
        // maxAge: 60 * 60 * 24, // expire in 1day
    })
}
