import { isAuthenticatedUser } from "@/dal/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";

export async function DELETE(req: NextRequest){
    if (!await isAuthenticatedUser()) return NextResponse.redirect("/login");   
    if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 

    const payload = await UserPayload();

    try{
        await prisma.cart_items.deleteMany({
            where: { user_ID: Number(payload?.user_ID)},
        });
        
        return NextResponse.json({ message: "All items are deleted" });
    }catch(err: unknown){
        return NextResponse.json({ errorMessage: err  instanceof Error ? err.message : "Failed to delete all cart"}, { status: 500 })
    }
}