"use client";
import { TshirtType } from "@/lib/types/t-shirt-types";
import AllFilteredProducts from "./filtered-products";
import PaginationSelection from "../pagination/paginated-selection";
import usePaginationAndFiltered from "@/hooks/usePaginatedAndFiltered";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AllProductsWithPagination({
  props,
}: {
  props: TshirtType[];
}) {
  const { itemsPerPage, currentPage, setCurrentPage, currentData } =
    usePaginationAndFiltered({ props }, 9);
  const router = useRouter();

  // Auto-refresh every 30s
  useEffect(() => {
    router.refresh();
    const interval = setInterval(() => {
      console.log("View All Products data refreshed");
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <>
      {props.length === 0 ? (
        <p className="flex justify-center items-center h-65 sm:h-100  font-medium">
          Search not found :/
        </p>
      ) : (
        // <div className="flex justify-center items-center py-2">
        //     <Image src={"/images/png/bowling.png"} height={250} width={250} alt="bowling"/>
        // </div>
        <div className="font-bold grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AllFilteredProducts props={currentData} />
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <PaginationSelection
          totalItems={props.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
}
