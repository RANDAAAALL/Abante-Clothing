export function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`; 
    }
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
      return process.env.NEXT_PUBLIC_PROD_BASE_URL;
    }
    // local dev
    return "http://localhost:3000";
  }
  