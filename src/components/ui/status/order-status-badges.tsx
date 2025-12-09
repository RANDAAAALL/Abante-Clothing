"use client";

import { getStatusBadgeColor } from "@/lib/helper/get-order-status-badge-color";
import { OrderStatusBadgesProps } from "@/lib/interface/order-status-badges";

export function OrderStatusBadges({
  orderStatus,
  totalReturnedAccepted,
  totalReturnedRejected,
  pendingReturnCount,
  totalItems,
  allReturned
}: OrderStatusBadgesProps) {
  if (allReturned) {
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-red-800">
        all returned
      </span>
    );
  }

  return (
    <>
      {orderStatus && (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
            orderStatus
          )}`}>
          {totalReturnedAccepted > 0 && (totalItems - totalReturnedAccepted) > 0
            ? `(${totalItems - totalReturnedAccepted}) ${orderStatus}`
            : orderStatus}
        </span>
      )}

      {/* returned accepted Badge */}
      {totalReturnedAccepted > 0 && (
        <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-red-800">
          ({totalReturnedAccepted}) returned
        </span>
      )}

      {/* returned rejected Badge */}
      {totalReturnedRejected > 0 && (
        <span className="inline-block px-2 py-1 rounded-full mt-1 text-xs font-medium bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200">
          ({totalReturnedRejected}) rejected
        </span>
      )}

      {/* pending return badge */}
      {pendingReturnCount > 0 && (
        <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-300 text-orange-800">
          ({pendingReturnCount}) pending return
        </span>
      )}
    </>
  );
}