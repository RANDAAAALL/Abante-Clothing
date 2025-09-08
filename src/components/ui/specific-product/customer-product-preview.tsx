"use client"

import { CustomerFeedbackURL } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "../pagination";
import { Card } from "../carousel/card";
import Image from "next/image";
import { CustomerFeedbackType } from "@/lib/types/customer-feedback-types";
import StartColorWithColor from "../main-section/customer-feedback-content/star-with-color";
import StartColorWithoutColor from "../main-section/customer-feedback-content/star-without-color";

export default function CustomerProductPreview(){
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(3);
    
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["customer-feedbacks"],
        queryFn: async () => {
            const res = await fetch(`${CustomerFeedbackURL}`);
            const data = await res.json();
            return data.customerFeedbackMockData;
        },
        networkMode: "online"
    });

    
    if(isError) return <span>Error: {error.message}</span>;

    const lastItemIndex = currentPage * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    console.log("All Datas: ", data);
    const currentItems:CustomerFeedbackType[] = data?.slice(firstItemIndex, lastItemIndex);
    console.log("Current Sliced Datas: ", currentItems);

    return (
        <>
        <div className="mx-auto md:mx-0"><span className="mt-9 font-bold text-lg">Product Preview</span></div>
        {isPending ? (
        <><span>Loading....</span></>
        ) : (
        <>
            {currentItems.map(( item, i ) => (
                <Card key={i} className="dark:bg-card-black-background mt-3 flex items-center flex-col sm:flex-row w-full px-6  min-h-32">
                
                {/* customer image */}
                <Image  
                src={item.imagePath}
                width={71}
                height={71}
                alt={item.imageAlt}
                className="rounded-full"/>

                {/* customer name, rating, feedback */}
                <div className="space-y-6 sm:space-y-3 text-sm flex-1 shrink-1">
                    <div className="font-bold text-center sm:text-start"><span>{item.name}</span></div>
                    
                    <div className="-mt-4 sm:-mt-2 flex justify-center sm:justify-start gap-1 ">
                    <StartColorWithColor />
                    <StartColorWithColor />
                    <StartColorWithColor />
                    <StartColorWithColor />
                    <StartColorWithoutColor />
                    </div>

                    <div className="text-justify hyphens-auto">
                    <span className="font-normal">{item.feedback}</span>
                    </div>

                </div>

                {/* feedback date */}
                <span className="text-right text-xs font-medium ">{item.feedbackDate}</span>
                </Card>
            ))}
            <PaginationSelection 
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}/>
        </>
        )}
        </>
    );
}

interface PaginationSelectionProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
}

function PaginationSelection({
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    }: PaginationSelectionProps){

    const pages: number[] = [];
    for(let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++){
        pages.push(i);
    }

    const handlePrevItem = () => {
        if(currentPage > 1){
            setCurrentPage(currentPage - 1);
        }
    }

    const handleNextItem = () => {
        if(currentPage < pages.length){
            setCurrentPage(currentPage + 1);
        }
    }
    
    return (
    <Pagination  className="mt-4 font-medium">
        <PaginationContent>
            <PaginationItem>
            <PaginationPrevious onClick={(e) => {
                e.preventDefault();
                handlePrevItem()
            }}/>
            </PaginationItem>
            {currentPage}
            <PaginationItem>
            <PaginationNext onClick={(e) => {
                e.preventDefault();
                handleNextItem();
            }
            }/>
            </PaginationItem>
        </PaginationContent>
    </Pagination>
    );    
}