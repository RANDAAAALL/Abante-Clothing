import { CustomerFeedbackRatingProps } from "@/lib/types/feedback-rating-types";
import StarColorWithoutColorSVG from "../icons/svg/star-without-color";
import StarColorWithColorSVG from "../icons/svg/star-with-color";

export default function CustomerFeedbackRating({rating, max = 5}: CustomerFeedbackRatingProps){
    
    return (
        <>
            <div className="-mt-4 sm:-mt-2 flex justify-center sm:justify-start gap-1 ">
            {[...Array(max)].map(( _, i) => (
                i < rating! ? ( 
                    <StarColorWithColorSVG key={i}/>
                ) : (
                    <StarColorWithoutColorSVG key={i}/>
                )
            ))}
            </div>
        </>
    );
}