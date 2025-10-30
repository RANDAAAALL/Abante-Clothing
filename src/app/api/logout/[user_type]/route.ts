import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user_type: string }> }
) {
  if (!await isAuthenticatedUser())
    return NextResponse.redirect(new URL("/login", req.url));

  if (!verifyCsrfToken(req))
    return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 });

  const userType = (await params).user_type;

  const res = NextResponse.json({ successMessage: "Logout Successfully." });

  res.headers.set("Cache-Control", "no-store");

  const cookieOptions: Partial<ResponseCookie> = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", 
    maxAge: 0,
  };

  res.cookies.set({ name: "session_token", value: "", ...cookieOptions });
  res.cookies.set({ name: "refresh_token", value: "", ...cookieOptions });
  res.cookies.set({ name: "csrf_token", value: "", ...cookieOptions });

  if (userType === "user") {
    revalidateTag("shipping");
    revalidateTag("billing");
    revalidateTag("access-details");
    revalidateTag("order-history");
  }

  return res;
}
