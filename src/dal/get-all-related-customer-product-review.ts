import { filterUniqueUserFeedbacks } from "@/lib/helper/filter-unique-user-feedbacks";
import prisma from "@/lib/prisma/prisma";

export const getAllRelatedCustomerProductReview = async (product_item_name: string) => {
  try {
    const feedbacks = await prisma.users_feedback.findMany({
      where: {
        order_details: {
          product_items: {
            product_item_name: product_item_name,
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
        order_details: {
          select: {
            product_items: {
              select: {
                product_item_name: true,
                product_item_color: true,
              },
            },
          },
        },
      },
      orderBy: {
        feedback_date: "desc",
      },
    });

    const mappedFeedbacks = feedbacks.map(fb => ({
      ...fb,
      product_item_name: fb.order_details?.product_items?.product_item_name ?? null,
      product_item_color: fb.order_details?.product_items?.product_item_color ?? null,
    }));

    return filterUniqueUserFeedbacks(mappedFeedbacks, 'per-user');
  } catch (err) {
    console.error(err);
    return [];
  }
};