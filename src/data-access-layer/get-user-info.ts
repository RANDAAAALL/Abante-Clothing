import prisma from "@/lib/prisma/prisma";
import { isAuthenticatedUser } from "./verify-user";
import { redirect } from "next/navigation";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";

type Props = {
    user_image: string | null;
    username: string | null;
    email: string | null;
} | null

export const getUserInfo = async (): Promise<Props> => {
    if(!await isAuthenticatedUser()) redirect("/login");
    
    const payload = await UserPayload();
    
    const data = await prisma.users.findUnique({
        where: { user_ID: Number(payload?.user_ID)},
        select: {
            user_image: true,
            username: true,
            email: true,
        }
    });
    return data;
};