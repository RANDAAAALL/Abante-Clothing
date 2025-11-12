import React, { useEffect, useRef } from "react";
import { useCartItems } from "@/lib/store/cart-items";

function TshirtSizesButtonsContent({
  currentSizes,
  productID, 
  product_item_stock,
}: {
  currentSizes?: string | null;
  productID?: number | string | null;
  product_item_stock?: number | null;
}) {
  const { selectedSize, setSelectedSize } = useCartItems();
  const prevProductId = useRef<number | string | null>(null);
  const allSizes = ["XS", "S", "M", "L", "XL", "OS"];
  const availableSizes = currentSizes?.split(",").map((s) => s.trim().toUpperCase()) ?? [];
  
  useEffect(() => {
    if (productID && prevProductId.current !== productID) {
      setSelectedSize(null);
      prevProductId.current = productID;
    }
  }, [productID, setSelectedSize]);

  return (
    <>
      <div><span className="font-bold text-lg">Size</span></div>

      <div className="flex gap-2 -mt-3">
        {allSizes.map((size, i) => {
          const isAvailable = availableSizes.includes(size) && product_item_stock !== 0;

          return (
            <button
              key={i}
              onClick={() => isAvailable && setSelectedSize(size)}
              type="button"
              disabled={!isAvailable}
              className={`font-regular text-xs mt-1 rounded-sm py-2 transition w-full
                ${
                  selectedSize === size
                    ? "bg-[#666666] text-white"
                    : isAvailable
                    ? "cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black"
                    : "opacity-50 bg-card-black-background dark:bg-card-white-background dark:text-black text-white cursor-not-allowed"
                }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </>
  );
}

const AddToCartAndBuyNowButtons = React.memo(TshirtSizesButtonsContent);
export default AddToCartAndBuyNowButtons;
