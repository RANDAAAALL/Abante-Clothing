import { NextRequest } from "next/server";

export const getClientIP = (req: NextRequest) => {
  // vercel or proxies add x-forwarded-for
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  // some providers use x-real-ip
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;

  // localhost fallback
  return "127.0.0.1";
};
