"use client";
import { useEffect } from "react";
import usePaginationAndFiltered from "../../hooks/usePaginatedAndFiltered";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { OrderReceiptModalProps } from "@/lib/types/order-history-receipt-types";
import PaginationSelection from "@/components/ui/pagination/paginated-selection";
import OrderHistoryReceiptModal from "../ui/modal/order-history/order-history-receipt-modal";
import TableBody from "@/components/table/table-body";

export default function PaginatedTable<T extends Record<string, string | number>>({
  TheadData,
  TbodyData,
  OrderReceiptModalData,
}: {
  TheadData: (keyof T)[];
  TbodyData: T[];
  OrderReceiptModalData: OrderReceiptModalProps[];
}) {
  const { itemsPerPage, currentPage, setCurrentPage, currentData } =
    usePaginationAndFiltered({ props: TbodyData }, 6);

  const { isOpen, setOrderHistoryReceiptData } = useOrderHistoryReceiptModal();

  useEffect(() => {
    if (!OrderReceiptModalData) return;
    setOrderHistoryReceiptData(OrderReceiptModalData);
  }, [OrderReceiptModalData, setOrderHistoryReceiptData]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-0.5">
        <TableBody TbodyData={currentData} TheadData={TheadData} />
      </div>

      <PaginationSelection
        style="mt-6"
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
