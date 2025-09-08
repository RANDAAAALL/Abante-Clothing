"use client"

import { CustomerFeedbackURL } from "@/lib/config";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "../pagination";
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
        <div className="grid grid-cols-1 gap-2 sm:gap-1">
            {currentItems.map(( item, i ) => (
                <Card key={i} className="mt-3 flex items-center flex-col sm:flex-row w-full px-6">
                
                {/* customer image */}
                <Image  
                src={item.imagePath}
                width={71}
                height={71}
                alt={item.imageAlt}
                className="rounded-full"/>

                {/* customer name, rating, feedback */}
                <div className="space-y-4 text-sm flex-1 shrink-1">
                <div className="font-bold text-center sm:text-start"><span>{item.name}</span></div>
                
                <div className="-mt-3 sm:-mt-3 flex justify-center sm:justify-start gap-1 ">
                <StartColorWithColor />
                <StartColorWithColor />
                <StartColorWithColor />
                <StartColorWithColor />
                <StartColorWithoutColor />
                </div>

                <span className="font-normal">{item.feedback}</span>

                </div>

                {/* feedback date */}
                <span className="text-right text-xs font-medium ">{item.feedbackDate}</span>
                </Card>
            ))}
        </div>
        <PaginationSelection 
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        />
        </>
        )}
        </>
    );
}

interface PaginationSelectionProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: any;
}

function PaginationSelection({
    totalItems,
    itemsPerPage,
    currentPage,
    setCurrentPage,
    }: PaginationSelectionProps){

    let pages: any = [];
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
            <PaginationPrevious onClick={() => handlePrevItem()}/>
            </PaginationItem>
            {currentPage}
            <PaginationItem>
            <PaginationNext
            onClick={() => handleNextItem()}/>
            </PaginationItem>
        </PaginationContent>
    </Pagination>
    );    
}