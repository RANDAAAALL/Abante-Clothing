import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export async function GET(req: Request) {

  const customerFeedbacks = await prisma.users_feedback.findMany({
    select: {
      feedback_ID: true,
      feedback_comment: true,
      feedback_rating: true,
      feedback_date: true,
      users: {
        select: {
          username: true,
          user_image: true,
        },
      },
    },
  });

  return NextResponse.json({
    message: "fetched successfully!",
    customerFeedbacks
  });
}