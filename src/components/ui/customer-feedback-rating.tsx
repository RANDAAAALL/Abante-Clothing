import { CustomerFeedbackRatingProps } from "@/lib/types/feedback-rating-types";
import StarColorWithoutColorSVG from "../icons/svg/star-without-color";
import StarColorWithColorSVG from "../icons/svg/star-with-color";

export default function CustomerFeedbackRating({
  rating,
  max = 5,
  onChange,
}: CustomerFeedbackRatingProps) {
  return (
    <div className="-mt-4 sm:-mt-2 flex justify-center sm:justify-start gap-1">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(starValue)}
            className="p-0.5"
          >
            {i < (rating ?? 0) ? <StarColorWithColorSVG /> : <StarColorWithoutColorSVG />}
          </button>
        );
      })}
    </div>
  );
}
