"use client";
import Image from "next/image";
import { OrderReceiptDateFormatter } from "@/lib/helper/order-receipt-date-formatter";
import { ProductCardProps } from "@/lib/interface/product-card";

export function ProductCard({
  product,
  returnStatus,
  isSelected,
  canSelect,
  onToggleSelection,
  children,
  showCheckbox = true,
  borderColor = "border-gray-300 dark:border-gray-400",
  isSubmitting = false
}: ProductCardProps) {
  const {
    hasReturns,
    latestReturn,
    isReturned,
    isReturnAccepted,
    isReturnRejected,
    hasPendingReturn
  } = returnStatus;

  const id = `${product.order_detail_ID}`;
  const isReceived = !!product.feedback_rating;

  return (
    <div
      className={`flex flex-col p-3 border rounded-xl transition-all ${borderColor} ${
        canSelect ? "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500" : "cursor-not-allowed"
      }`}
      onClick={() => canSelect && onToggleSelection(id)}
    >
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          {isReceived && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
              ✓ Received
            </span>
          )}
          {isReturnAccepted && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
              ✓ Return Accepted
            </span>
          )}
          {isReturnRejected && (
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-200">
              ✗ Return Rejected
            </span>
          )}
          {hasPendingReturn && (
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
              ⏳ Pending Return Request
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div>
            <p className="font-medium text-sm capitalize text-gray-900 dark:text-gray-100">
              {product.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Size: {product.size} | Color: {product.color}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Quantity: {product.qty}
            </p>
          </div>
        </div>
        {showCheckbox && (
          <input
            disabled={isSubmitting || isReturned || isReceived}
            type="checkbox"
            checked={isSelected || isReturned || isReceived}
            readOnly
            className={`${isSubmitting || isReturned || isReceived ? "cursor-not-allowed" : null} accent-blue-600 ${(isReturned || isReceived) ? "opacity-50" : ""}`}
          />
        )}
      </div>

      {/* Return Dates */}
      {(isReturnAccepted || isReturnRejected || hasPendingReturn) && latestReturn?.request_return_date && (
        <div className="mt-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Return requested: {OrderReceiptDateFormatter(latestReturn.request_return_date as string)}
          </p>
        </div>
      )}

      {isReturnAccepted && latestReturn?.returned_date && (
        <div className="mt-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Return completed: {OrderReceiptDateFormatter(latestReturn.returned_date as string)}
          </p>
        </div>
      )}

      {isReturnRejected && latestReturn?.returned_date && (
        <div className="mt-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Rejected completed: {OrderReceiptDateFormatter(latestReturn.returned_date as string)}
          </p>
        </div>
      )}

      {/* Additional Content */}
      {children}
    </div>
  );
}