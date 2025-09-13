import { CustomerFeedbackRatingProps } from "@/lib/types/feedback-rating-types";
import StarColorWithColor from "./main-section/customer-feedback-content/star-with-color";
import StarColorWithoutColor from "./main-section/customer-feedback-content/star-without-color";

export default function CustomerFeedbackRating({rating, max = 5}: CustomerFeedbackRatingProps){
    
    return (
        <>
            <div className="-mt-4 sm:-mt-2 flex justify-center sm:justify-start gap-1 ">
            {[...Array(max)].map(( _, i) => (
                i < rating! ? ( 
                    <StarColorWithColor key={i}/>
                ) : (
                    <StarColorWithoutColor key={i} />
                )
            ))}
            </div>
        </>
    );
}