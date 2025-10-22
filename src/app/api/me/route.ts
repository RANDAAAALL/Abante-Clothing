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
        
        return NextResponse.json({
            user_ID: payload.user_ID,
            username: payload.username,
            email: payload.email,
        }, {status: 200});
     }catch(err){
         return NextResponse.json({errorMessage: err}, {status: 401});
     }
}