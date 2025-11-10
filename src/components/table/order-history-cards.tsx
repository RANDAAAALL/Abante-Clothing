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
        
        // Check if all products are processed (received/rated or returned)
        const allProductsProcessed = orderData?.productDetails.every(
          (p) => {
            const hasFeedback = !!p.feedback_rating;
            const hasReturns = p.returns && p.returns.length > 0;
            const hasAcceptedReturn = hasReturns && p.returns?.some(r => r.is_return_accepted === "Accepted");
            const hasRejectedReturn = hasReturns && p.returns?.some(r => r.is_return_accepted === "Rejected");
            
            // Product is considered processed if:
            // - It has been rated (received) OR
            // - It has an accepted return OR
            // - It has a rejected return (considered final)
            return hasFeedback || hasAcceptedReturn || hasRejectedReturn;
          }
        );

        // Check if all products have ratings (all items received and rated)
        const allProductsFeedbacked = orderData?.productDetails.every(
          (p) => p.feedback_rating && p.feedback_rating > 0
        );

        // Calculate return statuses
        const totalItems = orderData?.productDetails.reduce(
          (sum, p) => sum + Number((p.qty ?? 0)),
          0
        ) || 0;

        const allReturns = orderData?.productDetails.flatMap(p => p.returns || []) || [];
        
        const totalReturnedAccepted = allReturns
          .filter(r => r.is_returned === 1 && r.is_return_accepted === "Accepted")
          .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

        const pendingReturnCount = allReturns
          .filter(r => r.is_returned === 1 && r.is_return_accepted === null)
          .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

        const totalReturnedRejected = allReturns
          .filter(r => r.is_returned === 1 && r.is_return_accepted === "Rejected")
          .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

        const allReturned = totalReturnedAccepted === totalItems && totalItems > 0;
        const nonReturnedLeft = totalItems - totalReturnedAccepted - pendingReturnCount;

        // Get order status
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
                  
                  // In the actions section, replace the button text logic:
                  const filteredActions = actions.map(action => {
                    // Always show "View Receipt" as is
                    if (action === "View Receipt") return action;
                    
                    // Check if there are any pending returns - if yes, don't change button titles
                    const hasPendingReturns = pendingReturnCount > 0;
                    
                    // Modify "Receive Order" button text
                    if (action === "Receive Order") {
                      // If there are pending returns, keep original title
                      if (hasPendingReturns) {
                        return action;
                      }
                      // Otherwise, if all products are processed (any mix of received/returned/rejected)
                      if (allProductsProcessed) {
                        return "✓ Order Completed";
                      }
                      return action;
                    }
                    
                    // Modify "Request Return" button text
                    if (action === "Request Return") {
                      // If there are pending returns, keep original title
                      if (hasPendingReturns) {
                        return action;
                      }
                      // Otherwise, if all products are processed
                      if (allProductsProcessed) {
                        return "✓ No Returns Left";
                      }
                      return action;
                    }
                    
                    return action;
                  }).filter(action => {
                    // Filter out actions that shouldn't be shown
                    if (action === "Receive Order" || action === "✓ Order Completed") {
                      return orderStatus?.toLowerCase() === "delivered" || allReturned;
                    }
                    
                    if (action === "Request Return" || action === "✓ No Returns Left") {
                      return orderStatus?.toLowerCase() === "delivered" || allReturned;
                    }
                    
                    return true;
                  });

                  return (
                    <div key={j} className="flex flex-col gap-2 pt-2 mt-auto">
                      {filteredActions.map((action, idx) => {
                        const actionText = String(action);
                        const isReceipt = actionText === "View Receipt";
                        const isReceiveOrder = actionText === "Receive Order" || actionText === "✓ Order Completed";
                        const isReturn = actionText === "Request Return" || actionText === "✓ No Returns Left";
                  
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
                  
                        // determine button style based on the action type
                        const getButtonStyle = (actionText: string | number) => {
                          const text = String(actionText);
                          
                          // for completed states with specific colors
                          if (text === "✓ Order Completed") {
                            return "w-full py-2 text-xs font-semibold rounded-md transition bg-green-600 text-white hover:bg-green-700";
                          } else if (text === "✓ No Returns Left") {
                            return "w-full py-2 text-xs font-semibold rounded-md transition bg-red-600 text-white hover:bg-red-700";
                          } 
                          // for other completed states (fallback)
                          else if (text.includes("✓")) {
                            return "w-full py-2 text-xs font-semibold rounded-md transition bg-gray-400 text-white hover:bg-gray-500";
                          } 
                          // default active buttons
                          else {
                            return "w-full py-2 text-xs font-semibold rounded-md transition bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200";
                          }
                        };
                  
                        return (
                          <Button
                            key={idx}
                            onClick={handleClick}
                            className={getButtonStyle(action)}
                            // disabled={actionText.includes("✓")} // Disable completed state buttons
                          >
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