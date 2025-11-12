"use client"
import { useCartItems } from "@/lib/store/cart-items";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";

function QuantityButtonsContent({productID, style, product_item_stock}
: {productID?: number | string | null, style?: string, product_item_stock?: number | null}){
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
        <button className={clsx(style, `${product_item_stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`)}  onClick={() => setDecreaseQuantity()}>-</button>
        <span className={clsx(style, `${product_item_stock === 0? "opacity-50 cursor-not-allowed" : ""}`)}>{product_item_stock === 0 ? 0 : quantity}</span>
        <button className={clsx(style, `${product_item_stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`)} onClick={() => setIncreaseQuantity(product_item_stock ?? 0)}>+</button>
        </>
    );
};


const QuantityButtons = React.memo(QuantityButtonsContent);
export default QuantityButtons;