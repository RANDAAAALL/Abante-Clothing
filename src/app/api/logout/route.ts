import { isAuthenticatedUser } from "@/dal/verify-user";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(){
    if(!await isAuthenticatedUser()) NextResponse.redirect("/login");
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
    
    revalidateTag("access-details");
    revalidateTag("order-history");
    // revalidatePath("/login")
    return res;
}