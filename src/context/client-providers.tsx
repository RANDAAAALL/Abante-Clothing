"use client"
import { ThemeProvider } from "next-themes";
import { QueryClient ,QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/lib/store/auth";

const queryClient = new QueryClient();

export default function ClientProvider({children}: { children: React.ReactNode}){
  const { setAuthUser, fetchUser } = useAuth();
  
  useEffect(() => {
      const stored = sessionStorage.getItem("successMessage");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuthUser(parsed);
        fetchUser();
      }

  }, [fetchUser, setAuthUser]);
  

    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        </ThemeProvider>
    )
}