import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";

export const getCustomerFeedbacksCached = unstable_cache(async () => {
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
    
    return customerFeedbacks;
}, ["customer-feedbacks"], { tags: ["customer-feedbacks"]});