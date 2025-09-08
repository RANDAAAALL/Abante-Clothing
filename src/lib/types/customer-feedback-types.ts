

// this will define the type for the customer feedback content
type CustomerFeedbackType = {
    id?: number,
    name: string,
    imagePath: string,
    imageAlt: string
    feedback: string,
    quoteUpIconPath: string,
    quoteUpIconAlt: string,
    quoteDownIconPath: string,
    quoteDownIconAlt: string,
    starRatingWithoutColorIconPath: string,
    starRatingWithoutColorIconAlt: string,
    starRatingWithColorIconPath: string,
    starRatingWithColorIconAlt: string,
    feedbackDate?: string,
}

export type { CustomerFeedbackType };