import { NextRequest } from "next/server";
import { safeCompare } from "./safe-compare";

export const verifyCsrfToken = (req: NextRequest): boolean => {
    const cookieCsrfToken = req.cookies.get("csrf_token")?.value;
    const headerCsrfToken = req.headers.get("x-csrf-token");

    // check for state changing requests
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      if (!cookieCsrfToken || !headerCsrfToken || !safeCompare(cookieCsrfToken, headerCsrfToken)) {
        return false;
      }
    }
    return true;
}