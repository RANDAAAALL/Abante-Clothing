import prisma from "@/lib/prisma/prisma";
export const getAllRelatedCustomerProductReview =  async () => {
  try{
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
  
      if(!customerFeedbacks) throw new Error("Customer Feedbacks not found!");
      return customerFeedbacks;
  }catch(err){
    console.log(err);
    return;
  }
}