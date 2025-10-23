import { useCartItems } from "@/lib/store/cart-items";
import React from "react";

function TshirtSizesButtonsContent(){
    const { selectedSize, setSelectedSize } = useCartItems();

    return (
        <>
        <div><span className="font-bold text-lg">Size</span></div>
        
        <div className="flex gap-2 -mt-3">      
        {["XS", "S", "M", "L", "XL", "OS"].map((size, i) => (
            <button onClick={() => setSelectedSize(size)}
            key={i}
            className={`font-regular text-xs mt-1 cursor-pointer rounded-sm w-full py-2
            ${selectedSize === size
            ? "bg-[#666666] text-white"
            : "bg-card-black-background text-white dark:bg-card-white-background dark:text-black"}`}>
            {size}
            </button>
        ))}
        </div>
        </>
    );
}

const AddToCartAndBuyNowButtons = React.memo(TshirtSizesButtonsContent);
export default AddToCartAndBuyNowButtons;
