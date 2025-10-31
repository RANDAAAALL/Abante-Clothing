import { verifyRefreshToken } from "@/lib/security/jwt/verify-refresh-token";
import { generateSessionToken } from "@/lib/security/jwt/generate-session-token";
import { NextRequest, NextResponse } from "next/server";
import { getRefreshCookie } from "@/lib/security/cookie/get-refresh-cookie";
import { UserPayloadProps } from "@/lib/interface/user-payload";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user_type: string }> }
) {
  const userType = (await params).user_type;
  const urlUserType = userType === "admin" ? "/admin/login?reason=expired" : "/login?reason=expired";

  const refreshToken = await getRefreshCookie();
  const csrfToken = verifyCsrfToken(req);

  if (!refreshToken || !csrfToken) {
    const res = NextResponse.json({
      ok: false,
      expired: true,
      url: urlUserType,
    });
    res.cookies.delete("session_token");
    res.cookies.delete("refresh_token");
    res.cookies.delete("csrf_token");
    return res;
  }

  try {
    const { payload } = await verifyRefreshToken(refreshToken);
    const parsedPayload = payload as UserPayloadProps;

    const now = Date.now() / 1000;
    const exp = parsedPayload.exp!;
    const oneDayInSeconds = 60 * 60 * 24;

    if (exp < now) {
      const res = NextResponse.json({
        ok: false,
        expired: true,
        url: urlUserType,
      });
      res.cookies.delete("session_token");
      res.cookies.delete("refresh_token");
      res.cookies.delete("csrf_token");
      return res;
    }

    const newSessionToken = await generateSessionToken(parsedPayload);
    const timeLeft = exp - now;
    const isLastTry = timeLeft < oneDayInSeconds; // expires within 1 day

    const res = NextResponse.json({ ok: true, isLastTry });

    res.cookies.set("session_token", newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: oneDayInSeconds,
    });

    return res;
  } catch (err) {
    const res = NextResponse.json({
      ok: false,
      expired: true,
      url: urlUserType,
    });
    res.cookies.delete("session_token");
    res.cookies.delete("refresh_token");
    res.cookies.delete("csrf_token");
    return res;
  }
}
