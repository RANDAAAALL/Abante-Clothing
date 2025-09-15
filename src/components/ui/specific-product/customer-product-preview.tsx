"use client"

import { Card } from "../carousel/card";
import Image from "next/image";
import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import { DateFormatter } from "@/lib/date-formatter";
import CustomerFeedbackRating from "../customer-feedback-rating";
import PaginationSelection from "../pagination/paginated-selection";
import usePaginationAndFilteredProducts from "@/hooks/usePaginationAndFilteredProducts";

export default function CustomerProductPreview( { props }: { props: CustomerFeedbackProps[]} ){
    const { itemsPerPage, currentPage, setCurrentPage, currentData } = usePaginationAndFilteredProducts({props}, 3);

    return (
        <>
        <div className="mx-auto md:mx-0"><span className="mt-9 font-bold text-lg">Product Preview</span></div>
            {currentData.map(( customer, i ) => (
                <Card key={i} className={`dark:bg-card-black-background mt-3 flex items-center flex-col sm:flex-row px-6 min-h-32`}>
                
                {/* customer image */}
                <Image  
                src={customer?.users?.user_image ?? "/images/png/default_avatar.pg"}
                width={71}
                height={71}
                alt="customer-feedback-alt"
                className="rounded-full"/>

                {/* customer name, rating, feedback */}
                <div className="space-y-6 sm:space-y-3 text-sm flex-1 shrink-1">
                    <div className="font-bold text-center sm:text-start"><span>{customer?.users?.username ?? "Anonymous"}</span></div>
                    
                    <CustomerFeedbackRating rating={customer?.feedback_rating} />

                    <div className="text-justify hyphens-auto">
                    <span className="font-normal">{customer?.feedback_comment}</span>
                    </div>

                </div>

                {/* feedback date */}
                <span className="text-right text-xs font-medium ">{DateFormatter(customer.feedback_date?.toString() ?? "N/A")}</span>
                </Card>
            ))}

            <PaginationSelection 
            totalItems={props.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}/>
        </>
    );
}
