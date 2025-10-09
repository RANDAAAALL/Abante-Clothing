import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(){
    const res = NextResponse.json({ successMessage: "Logged out successfully" });

    // force deletion on a cookie
    res.cookies.set({
        name: "access_token",
        value: "",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });
    
    revalidatePath("/login");
    return res;
}