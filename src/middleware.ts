import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/security/jwt/verify-session-token";
import { generateSessionToken } from "./lib/security/jwt/generate-session-token";
import { UserPayloadProps } from "./lib/interface/user-payload";
import { verifyRefreshToken } from "./lib/security/jwt/verify-refresh-token";

export async function middleware(request: NextRequest) {
  const routes = {
    protectedRoutes: [
      "/profile",
      "/profile/billing",
      "/profile/order-history",
      "/profile/address",
      "/checkout",
    ],
    protectedApiRoutes: [
      "/api/add-to-cart",
      "/api/get-cart",
      "/api/delete-cart",
      "/api/delete-all-cart",
      "/api/upload-profile-picture",
      "/api/checkout",
      "/api/generate-receipt",
      "/api/csrf",
      "/api/me",
    ],
    passRoutes: [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ],
  };

  const { pathname, origin } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "");
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // allow public routes
  // const isPassRoute = routes.passRoutes.some(route => pathname.startsWith(route));
  // if (isPassRoute) return NextResponse.next();

  const isProtectedPage = routes.protectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedApi = routes.protectedApiRoutes.some(route => pathname.startsWith(route));

  if (!sessionToken) {
    if (isProtectedApi) {
      return NextResponse.json({ errorMessage: "Unauthorized" }, { status: 401 });
    } else if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login?reason=expired", origin));
    }
  }

  try {
    await verifySessionToken(sessionToken!);
    return NextResponse.next();
  } catch {
    if (refreshToken) {
      try {
        const { payload } = await verifyRefreshToken(refreshToken);
        const parsedPayload = payload as UserPayloadProps;
        const newSessionToken = await generateSessionToken(parsedPayload);

        const res = NextResponse.redirect(request.url);
        res.cookies.set("session_token", newSessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 15, // 15 mins expiration
          // maxAge: 60, // 1 min expiration for testing purposes
        });

        return res;
      } catch {
        const res = NextResponse.redirect(new URL("/login?reason=expired", origin));
        res.cookies.set({name: "session_token", value: "", maxAge: 0});
        res.cookies.set({name: "refresh_token", value: "", maxAge: 0});
        res.cookies.set({name: "csrf_token", value: "", maxAge: 0});
        localStorage.removeItem("successMessage");
        return res;
      }
    }

    const res = NextResponse.redirect(new URL("/login?reason=expired", origin));
    res.cookies.set({name: "session_token", value: "", maxAge: 0});
    res.cookies.set({name: "refresh_token", value: "", maxAge: 0});
    res.cookies.set({name: "csrf_token", value: "", maxAge: 0});
    localStorage.removeItem("successMessage");
    return res;
  }
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
    "/api/me",
  ],
};
