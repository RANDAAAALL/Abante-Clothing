import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function runs on every matched route
export function middleware(request: NextRequest) {
  // Example: block access if not logged in
  // (for now, just let all requests pass through)
  console.log("Middleware is running on: ", request.nextUrl.pathname)
  return NextResponse.next();
}

// protected routes as of now
export const config = {
    matcher: [
      "/(protected)/:path*",
      "/api/:path*",  
    ],
  };


  