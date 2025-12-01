
type CustomerFeedbackRatingProps = {
    rating: number | null; 
    max?: number; 
    onChange?: (value: number) => void;
    isSubmitting?: boolean;
  };

export type { CustomerFeedbackRatingProps };