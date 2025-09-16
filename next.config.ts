// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

// your base config
const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  allowedDevOrigins: [
    process.env.LOCAL_LAN_IP_ADDRESS ?? "http://localhost:3000",
    "https://abante-clothing.vercel.app/",
  ],
};

// wrap it with bundle analyzer
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
