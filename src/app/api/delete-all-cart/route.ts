import { isAuthenticatedUser } from "@/data-access-layer/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export async function DELETE(){
    if (!await isAuthenticatedUser()) return NextResponse.redirect("/login");   

    const payload = await UserPayload();

    try{
        await prisma.cart_items.deleteMany({
            where: { user_ID: Number(payload?.user_ID)},
        });
        
        return NextResponse.json({ message: "All items are deleted" });
    }catch(err){
        return NextResponse.json({ errorMessage: err }, { status: 500 })
    }
}