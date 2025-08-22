// protected routes as of now
export const config = {
    matcher: [
      "/(protected)/:path*",
      "/api/:path*",  
    ],
  };