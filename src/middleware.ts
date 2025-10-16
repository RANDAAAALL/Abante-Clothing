import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VerifyAuthToken } from "./lib/security/jwt";
import { JWTExpired, JWTInvalid } from "jose/errors";

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("access_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const url = request.nextUrl.clone();

  // if no token and trying to access protected routes, redirect to login
  if (!token &&
    (request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/profile/address") ||
    request.nextUrl.pathname.startsWith("/profile/billing") ||
    request.nextUrl.pathname.startsWith("/profile/order-history"))
    ){
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

  // verify token for protected routes
  if (token) {
    try {
      await VerifyAuthToken(token);
      return NextResponse.next({
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store",
        },
      });
    } catch (err) {
      if (err instanceof JWTExpired) return NextResponse.redirect(new URL("/login?reason=expired", request.url));
      if (err instanceof JWTInvalid) return NextResponse.redirect(new URL("/login?reason=invalid", request.url));
      return NextResponse.redirect(new URL("/login?reason=unknown", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/profile/billing",
    "/profile/order-history",
    "/profile/address",
    "/api/add-to-cart",
    "/api/get-cart",
    "/api/delete-cart",
    "/api/delete-all-cart",
    "/api/uploaded-profile-picture",
    "/checkout",
    "/api/checkout",
    "/api/generate-receipt",
  ],
};