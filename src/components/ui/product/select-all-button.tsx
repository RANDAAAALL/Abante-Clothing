"use client";
import { Button } from "@/components/ui/button";
import { SelectAllButtonProps } from "@/lib/interface/select-all-button";

export function SelectAllButton({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onDeselectAll,
  className = "",
  isSubmitting = false
}: SelectAllButtonProps) {
  if (totalCount <= 1) return null;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {selectedCount} of {totalCount} products selected
      </span>
      {!isAllSelected ? (
        <Button
          disabled={isSubmitting}
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className={`${isSubmitting ? "cursor-not-allowed" : null} text-xs`}
        >
          Select All ({totalCount})
        </Button>
      ) : (
        <Button
          disabled={isSubmitting}
          variant="outline"
          size="sm"
          onClick={onDeselectAll}
          className={`${isSubmitting ? "cursor-not-allowed" : null} text-xs`}
        >
          Deselect All
        </Button>
      )}
    </div>
  );
}