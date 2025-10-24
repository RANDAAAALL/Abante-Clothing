import { getSessionCookie } from "@/lib/security/cookie/get-session-cookie";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
    children,
}: {
    children: ReactNode
}) {
    const token = await getSessionCookie();
    if(token) redirect("/");
  
    return <>{children}</>   
}