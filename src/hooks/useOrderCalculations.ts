import { useMemo } from "react";
import { OrdersProps } from "@/lib/types/orders-types";

export function useOrderCalculations(orders: OrdersProps[]) {
  const totals = useMemo(() => {
    const counts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      pending_return: 0,
      returned: 0,
    };

    orders.forEach((order) => {
      const status = order.order_purchased_status?.toLowerCase();
      if (status && counts.hasOwnProperty(status)) {
        counts[status as keyof typeof counts]++;
      }
    });

    // Calculate return quantities
    const totalPendingQty = orders.reduce((sum, order) => {
      return (
        sum +
        order.order_details
          .flatMap(d => d.returns || [])
          .filter(returnItem => returnItem.is_returned === 1 && returnItem.is_return_accepted === null)
          .reduce((t, i) => t + (i.returned_product_qty || 0), 0)
      );
    }, 0);

    const totalReturnedQty = orders.reduce((sum, order) => {
      return (
        sum +
        order.order_details
          .flatMap(d => d.returns || [])
          .filter(returnItem => returnItem.is_returned === 1 && returnItem.is_return_accepted === "Accepted")
          .reduce((t, i) => t + (i.returned_product_qty || 0), 0)
      );
    }, 0);

    counts.pending_return = totalPendingQty;
    counts.returned = totalReturnedQty;

    return counts;
  }, [orders]);

  return { totals };
}