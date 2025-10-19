"use client";
import TableBody from "@/components/table/table-body";
import PaginationSelection from "@/components/ui/pagination/paginated-selection";
import usePaginationAndFiltered from "../../hooks/usePaginatedAndFiltered";
import TableHead from "@/components/table/table-head";

export default function PaginatedTable<T extends Record<string, unknown>>({
  TheadData,
  TbodyData,
}: { TheadData: (keyof T)[], TbodyData: T[] }) {
    const { itemsPerPage, currentPage, setCurrentPage, currentData } = usePaginationAndFiltered({props: TbodyData}, 4);
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="table-auto text-center border-collapse border border-gray-400 w-full">
          <TableHead TheadData={TheadData} />
          <TableBody TbodyData={currentData} TheadData={TheadData} />
        </table>
      </div>
      <PaginationSelection
        style="mt-4"
        totalItems={TbodyData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
</div>

  );
}
