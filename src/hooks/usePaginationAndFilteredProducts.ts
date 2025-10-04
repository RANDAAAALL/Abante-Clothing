"use client";
import { SlicedPaginatedData } from "@/lib/helper/sliced-paginated-date";
import { useState, useEffect } from "react";

export default function usePaginationAndFilteredProducts<T>(
  { props }: { props: T[] },
  propsLength: number 
) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [props]);

  const itemsPerPage = propsLength;

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;

  const currentData = SlicedPaginatedData({
    props,
    firstItemIndex,
    lastItemIndex,
  });

  return {
    itemsPerPage,
    currentPage,
    setCurrentPage,
    lastItemIndex,
    firstItemIndex,
    currentData,
  };
}
