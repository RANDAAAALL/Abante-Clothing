import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
export const getCustomerFeedbacksCached = unstable_cache(async () => {
  const customerFeedbacks = await prisma.users_feedback.findMany({
    select: {
      feedback_ID: true,
      feedback_comment: true,
      feedback_rating: true,
      feedback_date: true,
      user_ID: true,
      users: {
        select: {
          username: true,
          user_image: true,
        },
      },
    },
    orderBy: {
      feedback_date: "desc",
    },
  });

  const seen = new Map<number, boolean>();
  const filteredFeedbacks = customerFeedbacks.filter((fb) => {
    if (fb.feedback_comment !== "No additional comments provided.") return true;

    const userId = fb.user_ID;
    if (seen.has(userId ?? 0)) return false; 
    seen.set(userId ?? 0, true);
    return true;
  });

  return filteredFeedbacks;
}, ["customer-feedbacks"], { tags: ["customer-feedbacks"], revalidate: 30 });
