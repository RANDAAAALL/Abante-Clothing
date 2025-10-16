import { getAuthCookie } from "@/lib/security/cookies";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
    children,
}: {
    children: ReactNode
}) {
    const token = await getAuthCookie();
    if(token) redirect("/");
  
    return <>{children}</>   
}