import prisma from "@/lib/prisma/prisma";


export const getRelatedCustomerProductReview =  async () => {
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

    if(!customerFeedbacks) console.error("Customer Feedbacks not found!");

    return customerFeedbacks;
}