"use client";
import { useEffect, useMemo, useState } from "react";
import usePaginationAndFiltered from "../../hooks/usePaginatedAndFiltered";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { OrderReceiptModalProps } from "@/lib/types/order-history-receipt-types";
import PaginationSelection from "@/components/ui/pagination/paginated-selection";
import OrderHistoryReceiptModal from "../ui/modal/order-history/order-history-receipt-modal";
import OrderHistoryCards from "@/components/table/order-history-cards";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { getNoOrdersMessage } from "@/lib/helper/get-no-orders-message";
import { getNoOrdersDescription } from "@/lib/helper/get-no-orders-description";

export default function PaginateOrderHistoryCards<T extends Record<string, string | number | string[]>>({
  TheadData,
  TbodyData,
  OrderReceiptModalData,
}: {
  TheadData: (keyof T)[];
  TbodyData: T[];
  OrderReceiptModalData: OrderReceiptModalProps[];
}) {
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Filter the data based on the selected status
  const filteredData = useMemo(() => {
    if (statusFilter === "All") return TbodyData;

    if (statusFilter === "Returned") {
      return TbodyData.filter((row) => {
        const orderNum = String(row["Order #"]);
        const orderData = OrderReceiptModalData?.find(
          (o) => o.orderNumber === orderNum
        );
        
        if (!orderData) return false;
        
        const allReturns = orderData.productDetails.flatMap(p => p.returns || []) || [];
        return allReturns.some(r => r.is_returned === 1 && r.is_return_accepted === "Accepted");
      });
    }

    if (statusFilter === "Pending Return") {
      return TbodyData.filter((row) => {
        const orderNum = String(row["Order #"]);
        const orderData = OrderReceiptModalData?.find(
          (o) => o.orderNumber === orderNum
        );
        
        if (!orderData) return false;
        
        const allReturns = orderData.productDetails.flatMap(p => p.returns || []) || [];
        return allReturns.some(r => r.is_returned === 1 && r.is_return_accepted === null);
      });
    }

    return TbodyData.filter(
      (row) => {
        const status = row["Status"] as string;
        return status?.toLowerCase() === statusFilter.toLowerCase();
      }
    );
  }, [TbodyData, OrderReceiptModalData, statusFilter]);

  const { itemsPerPage, currentPage, setCurrentPage, currentData } =
    usePaginationAndFiltered({ props: filteredData }, 4);

  const { isOpen, setOrderHistoryReceiptData } = useOrderHistoryReceiptModal();

  useEffect(() => {    
    if (!OrderReceiptModalData) return;
    setOrderHistoryReceiptData(OrderReceiptModalData);
  }, [OrderReceiptModalData, setOrderHistoryReceiptData]);

  return (
    <>
      {/* Filter Dropdown */}
      <div className="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <label className="text-2xl font-medium">Filter Orders by Status</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-40 justify-between">
              {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] md:w-40">
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
              {[
                "All",
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Pending Return",
                "Returned",
              ].map((s) => (
                <DropdownMenuRadioItem key={s} value={s}>
                  {s}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* No Orders Found Message */}
      {filteredData.length === 0 && (
        <div className="flex items-center justify-center h-64 md:h-111">
          <div className="text-center">
            <p className="text-lg font-medium text-black dark:text-white mb-2">
              {getNoOrdersMessage(statusFilter)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {getNoOrdersDescription(statusFilter)}
            </p>
          </div>
        </div>
      )}

      {/* Orders Grid */}
      {filteredData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-0.5">
            <OrderHistoryCards TbodyData={currentData} TheadData={TheadData} />
          </div>

          <PaginationSelection
            style="mt-6"
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {isOpen && (
        <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full sm:max-w-4xl mx-auto p-4">
          <OrderHistoryReceiptModal />
        </div>
      )}
    </>
  );
}