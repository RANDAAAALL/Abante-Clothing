import { cookies } from "next/headers";

// save token in cookie
export const setAuthCookie = async (token: string) => {
    (await cookies()).set("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
    })
}

// get token from cookie
export const getAuthCookie = async () => {
    return (await cookies()).get("access_token")?.value;
}