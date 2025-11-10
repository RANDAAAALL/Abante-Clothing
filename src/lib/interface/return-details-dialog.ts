import { OrderDetailProps } from "../types/orders-types";

export interface ReturnDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedReturn: OrderDetailProps | null;
    onAcceptOrReject: (return_ID: number, isReturnAccepted: boolean) => Promise<void>;
}