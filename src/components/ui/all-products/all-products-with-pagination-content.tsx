"use client"
import { TshirtType } from "@/lib/types/t-shirt-types";
import AllFilteredProducts from "./filtered-products";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import PaginationSelection from "../pagination/paginated-selection";

export default function AllProductsWithPaginationContent( {props}: {props: TshirtType[]} ){
    const isMobile = useMediaQuery({ maxWidth: 639 });

    const itemsPerPage = isMobile ? 1 : 4;
    const [ currentPage, setCurrentPage ] = useState(1);

    return (
        <>
            <div className="font-bold grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                <AllFilteredProducts props={props} itemsPerPage={itemsPerPage} currentPage={currentPage}/>
            </div>

            <div className="mt-4 flex justify-center">
                <PaginationSelection 
                totalItems={props.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}/>
            </div>
        </>
    );
}