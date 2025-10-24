"use client"
import { ThemeProvider } from "next-themes";
import { QueryClient ,QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/lib/store/auth";

export const queryClient = new QueryClient();

export default function ClientProvider({children}: { children: React.ReactNode}){
  const { checkAuthOnLoad } = useAuth();
  useEffect(() => { checkAuthOnLoad()}, [checkAuthOnLoad]);
  
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        </ThemeProvider>
    )
}