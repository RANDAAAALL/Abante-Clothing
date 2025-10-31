import { cookies } from "next/headers";

// save refresh token in cookie
export const setRefreshCookie = async (token: string) => {
    (await cookies()).set("refresh_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // maxAge: 60 * 3, // expire in 3 mins for testing purposes only
        // maxAge: 60 * 15, // expire in 15 minutes for testing purposes only
        // maxAge: 60 * 60 * 24, // expire in 1day
        maxAge: 60 * 60 * 24 * 7, // expire in 7 days
    })
}
