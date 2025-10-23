"use client";
import TableBody from "@/components/table/table-body";
import PaginationSelection from "@/components/ui/pagination/paginated-selection";
import usePaginationAndFiltered from "../../hooks/usePaginatedAndFiltered";
import TableHead from "@/components/table/table-head";
import { OrderReceiptModalProps } from "@/lib/types/order-history-receipt-types";
import { useEffect } from "react";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import OrderHistoryReceiptModal from "../ui/modal/order-history/order-history-receipt-modal";

export default function PaginatedTable<T extends Record<string, string | number>>({
  TheadData,
  TbodyData,
  OrderReceiptModalData,
}: { 
  TheadData: (keyof T)[],
  TbodyData: T[], 
  OrderReceiptModalData: OrderReceiptModalProps[]
}) {
    const { itemsPerPage, currentPage, setCurrentPage, currentData } = usePaginationAndFiltered({props: TbodyData}, 6);
    const { isOpen, setOrderHistoryReceiptData } = useOrderHistoryReceiptModal();

    useEffect(() => {
        if(!OrderReceiptModalData) return;
        setOrderHistoryReceiptData(OrderReceiptModalData);
    }, [OrderReceiptModalData, setOrderHistoryReceiptData]);

    return (
    <>
      <div className="overflow-x-auto h-auto md:h-116">
        <div className="min-w-[1000px]">
          <div className="overflow-x-auto mt-1">
            <table className=" table-auto text-center border-collapse border border-gray-400 w-full">
              <TableHead TheadData={TheadData} />
              <TableBody TbodyData={currentData} TheadData={TheadData} />
            </table>
          </div>
        </div>
      </div>
      <PaginationSelection
        style="mt-4"
        totalItems={TbodyData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {isOpen && ( 
        <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full sm:max-w-4xl mx-auto p-4">
          <OrderHistoryReceiptModal />
        </div>
      )}
    </>
  );
}
