"use client";
import { Button } from "@/components/ui/button";
import { SelectAllButtonProps } from "@/lib/interface/select-all-button";

export function SelectAllButton({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onDeselectAll,
  className = ""
}: SelectAllButtonProps) {
  if (totalCount <= 1) return null;

  return (
    <div className={`flex justify-between items-center ${className}`}>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {selectedCount} of {totalCount} products selected
      </span>
      {!isAllSelected ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          className="text-xs"
        >
          Select All ({totalCount})
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={onDeselectAll}
          className="text-xs"
        >
          Deselect All
        </Button>
      )}
    </div>
  );
}