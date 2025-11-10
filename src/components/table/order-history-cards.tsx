"use client";
import { useEffect, useState } from "react";
import { getStatusBadgeColor } from "@/lib/helper/get-order-status-badge-color";
import { getPaymentBadgeColor } from "@/lib/helper/get-payment-badge-color";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { TableBodyProps } from "@/lib/types/table-body-types";
import { Button } from "../ui/button";
import ReturnRequestDialog from "../ui/modal/order-history/request-return-dialog";
import { ProductItem } from "@/lib/interface/order-history-dialog";
import { useRouter } from "next/navigation";
import ReceiveOrderDialog from "../ui/modal/order-history/receive-order-dialog";

export default function OrderHistoryCards<
  T extends Record<string, string | number | string[]>
>({
  TheadData,
  TbodyData,
}: TableBodyProps<T>) {
  const { setOpenModal, setOrderPurchasedNumber, orderHistoryReceiptData } =
    useOrderHistoryReceiptModal();

  const [openReceiveOrder, setOpenOrderReceive] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (selectedOrder && orderHistoryReceiptData) {
      const orderData = orderHistoryReceiptData.find(
        (o) => o.orderNumber === selectedOrder
      );

      if (orderData) {
        const freshProducts = orderData.productDetails.map((p) => ({
          order_detail_ID: p.order_detail_ID, 
          order_purchased_ID: p.order_purchased_ID,
          name: p.name,
          size: p.size,
          color: p.color,
          image: p.image,
          qty: Number(p.qty),
          price: Number(p.price),
          feedback_comment: p.feedback_comment, 
          feedback_rating: p.feedback_rating, 
          returns: p.returns || []
        }));

        setSelectedProducts(freshProducts);
      }
    }
  }, [orderHistoryReceiptData, selectedOrder]); 

  const handleOpenDialog = (
    type: "receive order" | "return",
    orderNumber: string
  ) => {
    setSelectedOrder(orderNumber);
    
    const orderData = orderHistoryReceiptData?.find(
      (o) => o.orderNumber === orderNumber
    );

    if (orderData) {
      const products = orderData.productDetails.map((p) => ({
        order_detail_ID: p.order_detail_ID,
        order_purchased_ID: p.order_purchased_ID,
        name: p.name,
        size: p.size,
        color: p.color,
        image: p.image,
        qty: Number(p.qty),
        price: Number(p.price),
        feedback_comment: p.feedback_comment,
        feedback_rating: p.feedback_rating,
        returns: p.returns || []
      }));

      setSelectedProducts(products);
    }

    if (type === "receive order") setOpenOrderReceive(true);
    if (type === "return") setOpenReturn(true);
  };

  return (
    <>
      {TbodyData.map((row, i) => {
        const orderNum = String(row["Order #"]);
        const orderData = orderHistoryReceiptData?.find(
          (o) => o.orderNumber === orderNum
        );
        
        // check if all products have ratings (feedback given)
        const allProductsFeedbacked = orderData?.productDetails.every(
          (p) => p.feedback_rating && p.feedback_rating > 0
        );

        // calculate return statuses for the order using the new returns structure
        const totalItems = orderData?.productDetails.reduce(
          (sum, p) => sum + Number((p.qty ?? 0)),
          0
        ) || 0;

        // calculate from returns array instead of individual fields
        const allReturns = orderData?.productDetails.flatMap(p => p.returns || []) || [];
        
        const totalReturnedAccepted = allReturns
          .filter(r => r.is_returned === 1 && r.is_return_accepted === "Accepted")
          .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

        const pendingReturnCount = allReturns
          .filter(r => r.is_returned === 1 && r.is_return_accepted === null)
          .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

        // In the tableBody component, add this calculation after the existing return calculations:
        const totalReturnedRejected = allReturns
        .filter(r => r.is_returned === 1 && r.is_return_accepted === "Rejected")
        .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

        const allReturned = totalReturnedAccepted === totalItems && totalItems > 0;
        const nonReturnedLeft = totalItems - totalReturnedAccepted - pendingReturnCount;

        // get order status
        const orderStatus = row["Status"] as string;

        return (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-700 rounded-md shadow-sm p-4 flex flex-col bg-white dark:bg-card-black-background transition hover:shadow-md min-h-[280px]"
          >
            {/* header */}
            <h2 className="font-semibold text-base mb-3 line-clamp-1">
              {row[String(TheadData?.[0])] ?? "-"}
            </h2>

            {/* body fields */}
            <div className="flex flex-col space-y-2 text-sm flex-1">
              {TheadData?.slice(1).map((header, j) => {
                const label = String(header);
                const value = row[label] ?? "-";

                const isStatus = label.toLowerCase().includes("status");
                const isPayment = label.toLowerCase().includes("payment");
                const isActions = label.toLowerCase() === "actions";

                if (isActions) {
                  const actions = Array.isArray(value) ? value : [value];
                  
                  // filter actions - only show "Receive Order" and "Request Return" for delivered/all returned status
                  const filteredActions = actions.filter(action => {
                    // Always show "View Receipt"
                    if (action === "View Receipt") return true;
                    
                    // only show "Receive Order" and "Request Return" if status is delivered or all returned
                    if (action === "Receive Order" || action === "Request Return") {
                      return orderStatus?.toLowerCase() === "delivered" || allReturned;
                    }
                    
                    return true;
                  });

                  return (
                    <div key={j} className="flex flex-col gap-2 pt-2 mt-auto">
                      {filteredActions.map((action, idx) => {
                        const isReceipt = action === "View Receipt";
                        const isReceiveOrder = action === "Receive Order";
                        const isReturn = action === "Request Return";

                        const handleClick = () => {
                          if (isReceipt) {
                            setOpenModal();
                            setOrderPurchasedNumber(orderNum);
                          } else if (isReceiveOrder) {
                            handleOpenDialog("receive order", orderNum);
                          } else if (isReturn) {
                            handleOpenDialog("return", orderNum);
                          }
                        };

                        return (
                          <Button
                            key={idx}
                            onClick={handleClick}
                            className={`w-full py-2 text-xs font-semibold rounded-md transition bg-black text-white dark:bg-white dark:text-black`}>
                            {action}
                          </Button>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div key={j} className="flex justify-between items-center">
                    <span className="font-medium capitalize text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                    {isStatus ? (
                      <div className="flex flex-col gap-1 items-end">
                        {allReturned ? (
                          // all items returned
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-red-800">
                            all returned
                          </span>
                        ) : (
                          <>
                            {/* main status badge */}
                            {value && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                  value as string
                                )}`}>
                                {/* only show quantity for delivered status */}
                                {(value as string).toLowerCase() === "delivered" && nonReturnedLeft > 0 && totalReturnedAccepted > 0
                                  ? `(${nonReturnedLeft}) ${value}`
                                  : value}
                              </span>
                            )}
                            {/* returned accepted Badge */}
                            {totalReturnedAccepted > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-red-800">
                                ({totalReturnedAccepted}) returned
                              </span>
                            )}

                            {/* returned rejected Badge */}
                            {totalReturnedRejected > 0 && (
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200">
                                ({totalReturnedRejected}) rejected
                              </span>
                            )}

                            {/* pending return badge */}
                            {pendingReturnCount > 0 && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-300 text-orange-800">
                                ({pendingReturnCount}) pending return
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    ) : isPayment ? (
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium lowercase ${getPaymentBadgeColor(
                          value as string
                        )}`}
                      >
                        {value}
                      </span>
                    ) : (
                      <span className="text-gray-900 dark:text-gray-100">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <ReceiveOrderDialog
        isOpen={openReceiveOrder}
        onClose={() => setOpenOrderReceive(false)}
        order={{
          order_purchased_number: selectedOrder ?? "",
          products: selectedProducts,
        }}
        onUpdate={() => router.refresh()}
      />

      <ReturnRequestDialog
        isOpen={openReturn}
        onClose={() => setOpenReturn(false)}
        order={{
          order_purchased_number: selectedOrder ?? "",
          products: selectedProducts,
        }}
        onUpdate={() => router.refresh()}
      />
    </>
  );
}