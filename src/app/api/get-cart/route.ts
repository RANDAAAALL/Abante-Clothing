// import { isAuthenticatedUser } from "@/data-access-layer/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";

export async function GET(req: NextRequest){
    if(!await isAuthenticatedUser()) return NextResponse.json({ errorMessage: "Unauthorized" }, { status: 401 });
    if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 

    const payload = await UserPayload();

    const cartItems = await prisma.cart_items.findMany({
        where: { user_ID: Number(payload.user_ID)},
        orderBy: { cart_item_date: "desc"}
    });
    
    return NextResponse.json(cartItems);
}