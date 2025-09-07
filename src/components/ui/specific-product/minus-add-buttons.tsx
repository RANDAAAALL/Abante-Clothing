"use client"
import clsx from "clsx";
import { useState } from "react";

export default function MinusAddButtons({style}: {style?: string}){
    const [value, setValue] = useState(1);

    const handleClickIncreaseQuantity = () => {
        setValue((prev) => {
            if(prev <= 0){
                return 1;
            }

            return prev+=1;
        })
    }
    const handleClickDecreaseQuantity = () => {
        setValue((prev) => {
            if(prev <= 1) return 1;

            return prev-=1
        });
     }

    return (
        <>
        <button className={clsx(style, "cursor-pointer")} onClick={ handleClickDecreaseQuantity}>-</button>
        <span className={clsx(style, "cursor-default")}>{value}</span>
        <button className={clsx(style, "cursor-pointer")} onClick={handleClickIncreaseQuantity}>+</button>
        </>
    );
}