// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },

  // 👇 must be at top level, not inside experimental
  allowedDevOrigins: [
    process.env.LOCAL_LAN_IP_ADDRESS ??  "http://localhost:3000",
    "https://abante-clothing.vercel.app/",
  ],
};

export default nextConfig;
