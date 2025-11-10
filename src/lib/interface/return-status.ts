import { ProductItem } from "./order-history-dialog";

export interface ReturnStatus {
    hasReturns: boolean;
    latestReturn:  NonNullable<ProductItem['returns']>[number] | null;
    isReturned: boolean;
    isReturnAccepted: boolean;
    isReturnRejected: boolean;
    hasPendingReturn: boolean;
  }
  