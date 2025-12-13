"use client"

import { Card } from "../carousel/card";
import Image from "next/image";
import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import { DateFormatter } from "@/lib/helper/feedback-date-formatter";
import CustomerFeedbackRating from "../customer-feedback-rating";
import PaginationSelection from "../pagination/paginated-selection";
import usePaginationAndFiltered from "@/hooks/usePaginatedAndFiltered";

export default function CustomerProductPreview( { props }: { props: CustomerFeedbackProps[]} ){
    const { itemsPerPage, currentPage, setCurrentPage, currentData } = usePaginationAndFiltered({props}, 3);

    return (
        <>  
            <h2 className="mt-9 font-bold text-xl">Product Review</h2>
            {currentData.map(( customer, i ) => (
                <Card key={i} className={`dark:bg-card-black-background mt-3 md:gap-3 flex items-center flex-col sm:flex-row px-6 min-h-32`}>
                
                {/* customer image */}
                <div className="w-[71px] h-[71px] rounded-full overflow-hidden flex-shrink-0 md:mr-4">
                    <Image
                        src={customer?.users?.user_image ?? "/images/png/default_avatar.png"}
                        alt="customer-feedback-alt"
                        width={71}
                        height={71}
                        className="object-cover w-full h-full"/>
                    </div>


                {/* customer name, rating, feedback */}
                <div className="space-y-6 sm:space-y-3 text-sm flex-1 shrink-1">
                    <div className="font-bold text-center sm:text-start"><span>{customer?.users?.username ?? "Anonymous"}</span></div>
                    
                    <CustomerFeedbackRating rating={customer?.feedback_rating} />

                    <div className="text-center sm:text-justify hyphens-auto">
                    <span className="font-normal">
                    <span className="font-black text-xl">&ldquo; </span>
                    {customer?.feedback_comment}
                    <span className="font-black text-xl"> &rdquo;</span>
                    </span>
                    </div>

                </div>

                {/* feedback date */}
                <span className="text-right text-xs font-medium ">{DateFormatter(customer.feedback_date?.toString() ?? "N/A")}</span>
                </Card>
            ))}

            <PaginationSelection 
            style="mt-4"
            totalItems={props.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}/>
        </>
    );
}
