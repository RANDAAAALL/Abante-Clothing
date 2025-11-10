import { filterUniqueUserFeedbacks } from "@/lib/helper/filter-unique-user-feedbacks";
import prisma from "@/lib/prisma/prisma";

export const getAllRelatedCustomerProductReview = async (product_item_ID: number) => {
  try {
    // 1️get all feedbacks related to the clicked product
    const relatedFeedbacks = await prisma.users_feedback.findMany({
      where: {
        order_details: {
          is: {
            product_item_ID: product_item_ID,
          },
        },
      },
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

    // return only unique feedbacks 1 per user
    return filterUniqueUserFeedbacks(relatedFeedbacks);
  } catch (err) {
    // console.error(err);
    return [];
  }
};
