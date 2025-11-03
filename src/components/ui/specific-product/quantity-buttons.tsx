"use client"
import { useCartItems } from "@/lib/store/cart-items";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

function QuantityButtonsContent({productID, style}: {productID?: number | string | null, style?: string}){
    const { quantity , setIncreaseQuantity, setDecreaseQuantity, resetQuantity, resetSelectedSize } = useCartItems();
    const prevProductId = useRef<number | string | null>(null);

    useEffect(() => {
        if (productID && prevProductId.current !== productID) {
            resetQuantity();
            resetSelectedSize();
            prevProductId.current = productID;
          }
    }, [productID, resetQuantity, resetSelectedSize]);

    return (
        <>
        <button className={clsx(style, "cursor-pointer")} onClick={() => setDecreaseQuantity()}>-</button>
        <span className={clsx(style, "cursor-default")}>{quantity}</span>
        <button className={clsx(style, "cursor-pointer")} onClick={() => setIncreaseQuantity()}>+</button>
        </>
    );
};


const QuantityButtons = React.memo(QuantityButtonsContent);
export default QuantityButtons;