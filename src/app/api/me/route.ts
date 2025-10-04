import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextResponse } from "next/server";

export async function GET(){
    // try{
        const payload = await UserPayload();
        // if(!payload) return NextResponse.json({errorMessage: "Unauthorized"}, {status: 401});
        
        return NextResponse.json({
            user_ID: payload.user_ID,
            username: payload.username,
            email: payload.email,
        }, {status: 200});
    // }catch(err){
    //     return NextResponse.json({errorMessage: err}, {status: 401});
    // }
}