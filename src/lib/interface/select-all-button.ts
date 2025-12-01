export interface SelectAllButtonProps {
    selectedCount: number;
    totalCount: number;
    isAllSelected: boolean;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    className?: string;
    isSubmitting?: boolean;
  }
  