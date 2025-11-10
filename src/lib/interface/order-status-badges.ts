export interface OrderStatusBadgesProps {
    orderStatus: string;
    totalReturnedAccepted: number;
    totalReturnedRejected: number;
    pendingReturnCount: number;
    totalItems: number;
    allReturned: boolean;
}