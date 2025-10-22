import { cookies } from "next/headers";

// save token in cookie
export const setAuthCookie = async (token: string) => {
    (await cookies()).set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        // maxAge: 60 * 15, // expire in 15 minutes
        maxAge: 60 * 60, // expire in 1hr
    })
}
