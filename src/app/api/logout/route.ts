import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    if(!await isAuthenticatedUser()) NextResponse.redirect("/login");
    if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 
    const res = NextResponse.json({ successMessage: "Logged out successfully" });

    // force deletion on a session cookie
    res.cookies.set({
        name: "session_token",
        value: "",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });

    // force deletion on a refresh cookie
    res.cookies.set({
        name: "refresh_token",
        value: "",
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      });
    
    // force deletion on a csrf cookie
    res.cookies.set({
      name: "csrf_token",
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