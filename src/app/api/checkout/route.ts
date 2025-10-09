import { isAuthenticatedUser } from "@/data-access-layer/verify-user";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    if (!await isAuthenticatedUser()) return NextResponse.redirect("/login");

    const formData = await req.json();
    
    return NextResponse.json({ data: formData }, { status: 200 });
}