// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// your base config
const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: false,
  
  allowedDevOrigins: [
    process.env.LOCAL_LAN_IP_ADDRESS ?? "http://localhost:3000",
    "https://abante-clothing.vercel.app/",
    "https://abante-clothing-git-feature-lstrndgs-projects.vercel.app/",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",      
        pathname: "/**", 
      },
    ],
  },
}

// wrap it with bundle analyzer
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
