"use client"

import { useState } from "react";
import { Card } from "../carousel/card";
import Image from "next/image";
import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import { DateFormatter } from "@/lib/date-formatter";
import CustomerFeedbackRating from "../customer-feedback-rating";
import { useMediaQuery } from "react-responsive";
import { SlicedPaginatedData } from "@/lib/sliced-paginated-date";
import PaginationSelection from "../pagination/paginated-selection";

export default function CustomerProductPreview( { props }: { props: CustomerFeedbackProps[]} ){
    const isMobile = useMediaQuery({ maxWidth: 639 });

    const itemsPerPage = isMobile ? 1 : 3;
    const [ currentPage, setCurrentPage ] = useState(1);
    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    // console.log("All Datas: ", data);
    const currentCustomer = SlicedPaginatedData({props, firstItemIndex, lastItemIndex});
    // console.log("Current Sliced Datas: ", currentItems);

    return (
        <>
        <div className="mx-auto md:mx-0"><span className="mt-9 font-bold text-lg">Product Preview</span></div>
            {currentCustomer.map(( customer, i ) => (
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
