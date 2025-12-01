import { ProductItem } from "./order-history-dialog";
import { ReturnStatus } from "./return-status";

export interface ProductCardProps {
    product: ProductItem;
    returnStatus: ReturnStatus;
    isSelected: boolean;
    canSelect: boolean;
    onToggleSelection: (id: string) => void;
    children?: React.ReactNode;
    showCheckbox?: boolean;
    borderColor?: string;
    isSubmitting?: boolean;
  }