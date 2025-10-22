import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VerifyAuthToken } from "./lib/security/jwt/generate-auth-token";
import { JWTExpired, JWTInvalid } from "jose/errors";

export async function middleware(request: NextRequest) {
  const protectedRoutes = {
    routes: [
      "/profile",
      "/profile/billing",
      "/profile/order-history",
      "/profile/address",
      "/checkout",
    ],
    apiRoutes: [
      "/api/add-to-cart",
      "/api/get-cart",
      "/api/delete-cart",
      "/api/delete-all-cart",
      "/api/upload-profile-picture",
      "/api/checkout",
      "/api/generate-receipt",
      "/api/csrf",
    ]
  }
  const sessionToken = request.cookies.get("access_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
  
  const apiRoutes = protectedRoutes.apiRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  if(!sessionToken && apiRoutes) return NextResponse.json({ errorMessage: "Unauthorized" }, { status: 401 });
  
  const routes = protectedRoutes.routes.some((route) => request.nextUrl.pathname.startsWith(route));
  if(!sessionToken && routes) return NextResponse.redirect(new URL("/login", request.url));

  // verify token for protected routes
  if (sessionToken) {
    try {
      await VerifyAuthToken(sessionToken);
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
    "/checkout",
    "/api/add-to-cart",
    "/api/get-cart",
    "/api/delete-cart",
    "/api/delete-all-cart",
    "/api/upload-profile-picture",
    "/api/checkout",
    "/api/generate-receipt",
    "/api/csrf",
  ],
};