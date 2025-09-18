"use client"

import { TshirtType } from "@/lib/types/t-shirt-types";
import Image from "next/image";
import QuantityButtons from "./quantity-buttons";
import AddToCartAndBuyNowButtons from "./atc-and-bn-buttons";
import { ProductProps } from "@/lib/types/product-types";
import TshirtSizesButtons from "./sizes-buttons";

export default function HeroContents( {props} : { props: ProductProps<Partial<TshirtType>>} ){
    return (
        <>
        {props && props.product_item_image && props.product_item_back_image ? (
        <> 
        <div className="flex flex-col md:flex-row gap-5">

            {/* container */}
            <div className="flex gap-6 justify-center items-center">

                {/* images */}
                <div className="flex flex-col justify-center gap-3">
                <Image src={props.product_item_image} width={120} height={120} alt={`${props.product_item_ID}-${props.product_item_image}`}/>
                <Image src={props.product_item_back_image} width={120} height={120} alt={`${props.product_item_ID}-${props.product_item_back_image}`}/>
                <Image src={props.product_item_image} width={120} height={120} alt={`${props.product_item_ID}-${props.product_item_image}`}/>
                </div>
            
                <div><Image src={props.product_item_image} width={378} height={378} alt={`${props.product_item_ID}-${props.product_item_image}`}/></div>
            </div>
        
            {/* container */}
            <div className="flex flex-col gap-3 md:w-md">
                
                {/* t-shirt title and price*/}
                <div className="flex flex-row justify-between items-center md:items-start md:flex-col capitalize md:gap-1 font-bold md:mb-6">
                <span className="text-2xl md:text-3xl">{props.product_item_name}</span>
                <span className="text-2xl md:text-5xl" >P{props.product_item_price?.toString()}</span>
                </div>

                {/* t-shirt sizes */}
                <TshirtSizesButtons />

                {/* quantity buttons */}
                <div className="flex w-full sm:justify-center md:justify-start gap-1"><QuantityButtons style="text-center font-regular text-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black py-1 w-full md:w-auto md:px-6 rounded-sm"/></div>

                {/* add-to-cart and buy now buttons */}
                <div className="flex w-full sm:justify-center md:justify-start gap-1"><AddToCartAndBuyNowButtons props={props}/></div>
            </div>
        </div>
        </>
        ) : (
            <span>Loading...</span>
        )}
        </>
    );
}