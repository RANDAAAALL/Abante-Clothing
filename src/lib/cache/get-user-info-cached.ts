import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma/prisma";

export const getUserInfoCached = unstable_cache(async (userID: number) => {
    // console.log("getUserInfo HIT (unstable_cache)");

    const data = await prisma.users.findUnique({
        where: { user_ID: userID},
        select: {
            user_image: true,
            username: true,
            email: true,
        }
    });

    return data;
}, ["account-details"], { tags: ["account-details"] });