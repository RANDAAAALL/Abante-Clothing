import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { filterUniqueUserFeedbacks } from "../helper/filter-unique-user-feedbacks";

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

  // 1 feedback per user will be shown
  return filterUniqueUserFeedbacks(customerFeedbacks, 'per-user-per-product');
}, ["customer-feedbacks"], { tags: ["customer-feedbacks"], revalidate: 30 });
