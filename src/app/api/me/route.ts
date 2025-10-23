import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    if(!await isAuthenticatedUser()) NextResponse.redirect("/login");
    if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 

    const payload = await UserPayload();
    
    if(!payload) return NextResponse.redirect("/login");

     try{
       // return a success response
    return NextResponse.json(
        { successMessage: "Login successfully"},
        { status: 200 }
    );
     }catch(err: unknown){
         return NextResponse.json({errorMessage: err instanceof Error ? err.message : "Failed to fetch"}, {status: 500});
     }
}