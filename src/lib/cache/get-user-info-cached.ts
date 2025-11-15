import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma/prisma";

export const getUserInfoCached = unstable_cache(async (userID: number) => {
    // console.log("getUserInfo HIT (unstable_cache)");

    // const data = await prisma.users.findUnique({
    //     where: { user_ID: userID},
    //     select: {
    //         user_image: true,
    //         username: true,
    //         email: true,
    //     }
    // });

    // return data;

    const result: { get_user_info: string }[] = await prisma.$queryRaw`
    SELECT get_user_info(${userID}) AS get_user_info
  `;

    
    if (!result[0] || !result[0].get_user_info) return null;

    // MySQL might already return it as an object
    const data = typeof result[0].get_user_info === "string"
        ? JSON.parse(result[0].get_user_info)
        : result[0].get_user_info;

    return data;
}, ["account-details"], { tags: ["account-details"] });