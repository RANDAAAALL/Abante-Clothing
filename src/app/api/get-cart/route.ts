// import { isAuthenticatedUser } from "@/data-access-layer/verify-user";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export async function GET(){
    // if(!await isAuthenticatedUser()) return NextResponse.json({ errorMessage: "Unauthorized" }, { status: 401 });
    const payload = await UserPayload();

    const cartItems = await prisma.cart_items.findMany({
        where: { user_ID: Number(payload.user_ID)},
        orderBy: { cart_item_date: "desc"}
    });
    
    return NextResponse.json(cartItems);
}