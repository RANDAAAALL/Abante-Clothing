import { NextResponse } from "next/server";

export async function POST(){
    const res = NextResponse.json({ successMessage: "Logged out successfully" });
    res.cookies.delete("access_token");
    return res;
}