"use client"
import { ThemeProvider } from "next-themes";
import { QueryClient ,QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/lib/store/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { RefreshTokenURL } from "@/lib/config";

export const queryClient = new QueryClient();
const REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 6; // refresh token inverval rotation every 6 hours

export default function ClientProvider({children}: { children: React.ReactNode}){
  const router = useRouter();
  const { checkAuthOnLoad, isAuthenticated } = useAuth();
  useEffect(() => { checkAuthOnLoad()}, [checkAuthOnLoad]);

  useEffect(() => {
    // mark this as flag to run this useEffect or not
    if (!isAuthenticated?.successMessage) return;
  
    let lastRefresh = Date.now();
    let expired = false; // session tracker
  
    const refreshSession = async () => {
      if (expired) return; 
  
      try {
        const res = await fetchWithCsrf(`${RefreshTokenURL}/${isAuthenticated?.successMessage?.match(/!!/) ? "admin" : "user"}`,
          { method: "POST" }
        );
        const data = await res.json();
  
        if (data.expired) {
          // console.log("Expired");
          expired = true; 
          localStorage.removeItem("successMessage");
  
          setTimeout(() => {
            window.location.href = data.url;
          }, 100);
          return;
        }
  
        // if (data.isLastTry) console.log("Last try! Session will expire together with refresh token.");
  
        lastRefresh = Date.now();
      } catch {
        toast.error(`Failed to refresh token`);
      }
    };
  
    const handleVisibilityChange = () => {
      if (expired) return;
    
      if (document.visibilityState === "visible") {
        const now = Date.now();
    
        // calculate how many hours have passed since the last successful token refresh.
        // Date.now() returns milliseconds, so we divide by 1000 -> seconds, then 60 -> minutes, then 60 -> hours
        const hoursSinceLast = (now - lastRefresh) / 1000 / 60 / 60;
    
        // if more than 6 hours passed while the tab was inactive or hidden,
        // refresh the session immediately to keep tokens valid.
        if (hoursSinceLast >= 6) refreshSession();
      }
    };
    
  
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    const interval = setInterval(() => {
      if (!expired && document.visibilityState === "visible") refreshSession();
    }, REFRESH_INTERVAL_MS);
  
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isAuthenticated?.successMessage, router]);
  
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        </ThemeProvider>
    )
}