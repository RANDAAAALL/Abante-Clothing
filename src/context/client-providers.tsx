"use client"

import { ThemeProvider } from "next-themes";
import { QueryClient ,QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function ClientProvider({children}: { children: React.ReactNode}){
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        </ThemeProvider>
    )
}