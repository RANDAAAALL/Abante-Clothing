import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./lib/security/jwt/verify-session-token"; 
import { UserPayloadProps } from "./lib/interface/user-payload";

export async function middleware(request: NextRequest) {
  const routes = {
    userProtectedRoutes: [
      "/profile",
      "/profile/order-history",
      "/profile/billing",
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
      "/api/add-to-address-or-billing",
      "/api/update-address-or-billing",
      "/api/delete-address-or-billing",
      "api/update-order-status-and-tracking-number",
    ],
    adminProtectedRoutes: [
      "/admin/dashboard",
      "/admin/dashboard/orders",
      "/admin/dashboard/products",
      "/admin/dashboard/upload-product",
    ],
    passRoutes: [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/admin/login",
    ],
    publicRoutes: [
      "/",
      "/about",
      "/terms-and-conditions",
      "/all-products",
      "/privacy-policy",
    ]
  };

  const { pathname, origin } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token")?.value || request.headers.get("authorization")?.replace("Bearer ", "");

  // route categories
  const isProtectedPage = routes.userProtectedRoutes.some((r) => pathname.startsWith(r));
  const isAdminRoute = routes.adminProtectedRoutes.some((r) => pathname.startsWith(r));
  const isProtectedApi = routes.protectedApiRoutes.some((r) => pathname.startsWith(r));
  const isPassRoute = routes.passRoutes.some((r) => pathname.startsWith(r));
  const isUserPublicPage = routes.publicRoutes.some((r) => pathname === r);

  //  If there is no token
  if (!sessionToken) {
    // allow access to public pages like /login, /register and etc...
    if (isPassRoute) return NextResponse.next();

    // block protected routes
    if (isProtectedApi) return NextResponse.json({ errorMessage: "Unauthorized" }, { status: 401 });

    const redirectPath = pathname.startsWith("/admin") ? "/admin/login?reason=expired" : "/login?reason=expired";
    if (isProtectedPage || isAdminRoute)return NextResponse.redirect(new URL(redirectPath, origin));
  
    return NextResponse.next();
  }

  try {
    //  verify the session token
    const { payload } = await verifySessionToken(sessionToken);
    const user = payload as UserPayloadProps;

    //  block logged-in users or admins from visiting auth pages
    if (isPassRoute) {
      if (user.user_role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", origin));
      if (user.user_role === "user") return NextResponse.redirect(new URL("/", origin));
    }

    // block admin from visiting public routes
    if (user.user_role === "admin" && isUserPublicPage) return NextResponse.redirect(new URL("/admin/dashboard", origin));

    // role-based restrictions
    if (user.user_role === "admin" && isProtectedPage) return NextResponse.redirect(new URL("/admin/dashboard", origin))
    if (user.user_role === "user" && isAdminRoute) return NextResponse.redirect(new URL("/", origin));

    return NextResponse.next();
  } catch {
        const res = NextResponse.redirect(new URL("/login?reason=expired", origin));
        res.cookies.delete("session_token");
        res.cookies.delete("refresh_token");
        res.cookies.delete("csrf_token");
        return res;
    }
}

export const config = {
  matcher: [
    "/",
    "/about",
    "/terms-and-conditions",
    "/all-products",
    "/privacy-policy",
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
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/admin/login",
    "/admin/register",
    "/admin/dashboard",
    "/admin/dashboard/:path*",
    "/api/add-address-or-billing",
    "/api/update-address-or-billing",
    "/api/delete-address-or-billing",
    "api/update-order-status-and-tracking-number",
  ],
};
