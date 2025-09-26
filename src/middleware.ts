import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { VerifyAuthToken } from "./lib/security/jwt";
interface JWTError extends Error {
  code?: string;
}

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("access_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // if no token, redirect to login page
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

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
    const error = err as JWTError;
    
    if (error.code === "ERR_JWT_EXPIRED") {
      console.warn("Token expired");
      return NextResponse.redirect(new URL("/login?reason=expired", request.url));
    }

    if (error.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      console.error("Invalid signature — possible tampering");
      return NextResponse.redirect(new URL("/login?reason=invalid", request.url));
    }

    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/login?reason=unknown", request.url));
  }
}

// protected routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*",
  ],
};
