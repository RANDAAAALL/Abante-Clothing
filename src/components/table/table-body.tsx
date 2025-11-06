"use client";
import { getStatusBadgeColor } from "@/lib/helper/get-order-status-badge-color";
import { getPaymentBadgeColor } from "@/lib/helper/get-payment-badge-color";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { TableBodyProps } from "@/lib/types/table-body-types";
import { Button } from "../ui/button";

export default function TableBody<T extends Record<string, string | number>>({
  TheadData,
  TbodyData,
}: TableBodyProps<T>) {
  const { setOpenModal, setOrderPurchasedNumber } = useOrderHistoryReceiptModal();

  return (
    <>
      {TbodyData.map((row, i) => (
        <div
          key={i}
          className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 flex flex-col justify-between bg-white dark:bg-card-black-background transition hover:shadow-md"
        >
          {/* Header (Order Number or First Column) */}
          <h2 className="font-semibold text-base mb-3">
            {row[String(TheadData?.[0])] ?? "-"}
          </h2>

          {/* Body fields */}
          <div className="flex flex-col space-y-2 text-sm mb-4">
            {TheadData?.slice(1).map((header, j) => {
              const label = String(header);
              const value = row[label] ?? "-";

              const isStatus = label.toLowerCase().includes("status");
              const isPayment = label.toLowerCase().includes("payment");
              const isActions = label.toLowerCase() === "actions";

              // Handle Actions field separately
              if (isActions) {
                return (
                  <div key={j} className="pt-2">
                    <Button
                      onClick={() => {
                        setOpenModal();
                        setOrderPurchasedNumber(String(row["Order #"]));
                      }}
                      className="w-full bg-black text-white dark:bg-white dark:text-black rounded-md py-2 text-xs font-semibold hover:opacity-90 transition"
                    >
                      {value}
                    </Button>
                  </div>
                );
              }

              // Other fields
              return (
                <div key={j} className="flex justify-between items-center">
                  {/* Label */}
                  <span className="font-medium capitalize">{label}</span>

                  {/* Value */}
                  {isStatus ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                        value as string
                      )}`}
                    >
                      {value}
                    </span>
                  ) : isPayment ? (
                    <span
                      className={`px-2 py-0.5 rounded-md text-xs font-medium lowercase ${getPaymentBadgeColor(
                        value as string
                      )}`}
                    >
                      {value}
                    </span>
                  ) : (
                    <span>{value}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
