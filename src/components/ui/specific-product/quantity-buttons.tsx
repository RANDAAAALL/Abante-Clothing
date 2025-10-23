"use client"
import { useCartItems } from "@/lib/store/cart-items";
import clsx from "clsx";
import React from "react";

function QuantityButtonsContent({style}: {style?: string}){
    const { quantity , setIncreaseQuantity, setDecreaseQuantity } = useCartItems();

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