
// this will define the type for the customer feedback content
type CustomerFeedbackProps = {
    feedback_ID: number,
    feedback_comment: string | null,
    feedback_rating: number | null,
    feedback_date: string | Date | null,
    users: {
        username: string | null,
        user_image: string | null,
    } | null
};

export type { CustomerFeedbackProps };