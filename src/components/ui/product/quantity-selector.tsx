"use client";

import { QuantitySelectorProps } from "@/lib/interface/quantity-selector";

export function QuantitySelector({
  quantity,
  min = 1,
  max,
  onQuantityChange,
  label = "Quantity:",
  isSubmiitting = false
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-gray-600 dark:text-gray-400">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          className={`${isSubmiitting ? "cursor-not-allowed" : null} w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
          disabled={quantity <= min || isSubmiitting}
        >
          -
        </button>
        <span className="text-sm w-8 text-center">{quantity}</span>
        <button
          type="button"
          onClick={handleIncrement}
          className={`${isSubmiitting ? "cursor-not-allowed" : null} w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100 dark:hover:bg-gray-700`}
          disabled={quantity >= max || isSubmiitting}
        >
          +
        </button>
      </div>
    </div>
  );
}