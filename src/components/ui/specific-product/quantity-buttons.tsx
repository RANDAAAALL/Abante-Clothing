"use client"
import { useCartItems } from "@/lib/store/cart-items";
import clsx from "clsx";

export default function QuantityButtons({style}: {style?: string}){
    const { quantity , setIncreaseQuantity, setDecreaseQuantity } = useCartItems();

    return (
        <>
        <button className={clsx(style, "cursor-pointer")} onClick={() => setDecreaseQuantity(quantity)}>-</button>
        <span className={clsx(style, "cursor-default")}>{quantity}</span>
        <button className={clsx(style, "cursor-pointer")} onClick={() => setIncreaseQuantity(quantity)}>+</button>
        </>
    );
}