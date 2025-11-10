import { useCallback } from "react";
import { ProductItem } from "@/lib/interface/order-history-dialog";
import { ReturnStatus } from "@/lib/interface/return-status";

export const useProductStatus = () => {
  const getReturnStatus = useCallback((product: ProductItem): ReturnStatus => {
    if (!Array.isArray(product.returns) || product.returns.length === 0) {
      return {
        hasReturns: false,
        latestReturn: null,
        isReturned: false,
        isReturnAccepted: false,
        isReturnRejected: false,
        hasPendingReturn: false
      };
    }

    const latestReturn = product.returns[product.returns.length - 1];
    const isReturned = product.returns.some(r => r.is_returned === 1);
    const isReturnAccepted = latestReturn.is_return_accepted === "Accepted";
    const isReturnRejected = latestReturn.is_return_accepted === "Rejected";
    const hasPendingReturn = product.returns.some(r => r.is_returned === 1 && r.is_return_accepted === null);

    return {
      hasReturns: true,
      latestReturn,
      isReturned,
      isReturnAccepted,
      isReturnRejected,
      hasPendingReturn
    };
  }, []);

  return { getReturnStatus };
};