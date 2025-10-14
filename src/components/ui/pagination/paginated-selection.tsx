import { Dispatch, SetStateAction } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "./pagination";
import clsx from "clsx";
interface PaginationSelectionProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: Dispatch<SetStateAction<number>>;
    style?: string
}

export default function PaginationSelection({
    style,
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
    <Pagination className={clsx(style,"font-medium")}>
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