import { cookies } from "next/headers";

export const setCsrfToken = async (csrfToken: string) => {
        (await cookies()).set("csrf_token", csrfToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60,
        })
}