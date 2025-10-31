import { cookies } from "next/headers";

export const setCsrfToken = async (csrfToken: string) => {
        (await cookies()).set("csrf_token", csrfToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            // maxAge: 60 * 3, // 3 mins for test purposes only
            // maxAge: 60 * 60 * 24, // expire in 1day
            maxAge: 60 * 60 * 24 * 7, // expire in 7 days
        })
}