import { TshirtType } from "@/lib/types/t-shirt-types";
import Image from "next/image";
import MinusAddButtons from "./minus-add-buttons";
import AddToCartAndBuyNowButtons from "./atc-and-bn-buttons";

export default function HeroContents( {props} : { props: Partial<TshirtType>} ){
    return (
        <>
        {props && props.product_item_image && props.product_item_back_image ? (
        <> 
        <div className="flex flex-col items-center md:flex-row md:px-4 gap-4">

            {/* container */}
            <div className="flex gap-6 px-4 md:px-0">

                {/* images */}
                <div className="flex flex-col justify-center gap-1">
                <Image src={props.product_item_image} width={120} height={120} alt={`${props.product_item_ID}-${props.product_item_image}`}/>
                <Image src={props.product_item_back_image} width={120} height={120} alt={`${props.product_item_ID}-${props.product_item_back_image}`}/>
                <Image src={props.product_item_image} width={120} height={120} alt={`${props.product_item_ID}-${props.product_item_image}`}/>
                </div>
            
                <div><Image src={props.product_item_image} width={378} height={378} alt={`${props.product_item_ID}-${props.product_item_image}`}/></div>
            </div>
        
            {/* container */}
            <div className="flex flex-col gap-3 px-5 w-full sm:px-9 md:px-4 md:w-md">
                
                {/* t-shirt title and price*/}
                <div className="flex flex-row justify-between items-center md:items-start md:flex-col capitalize md:gap-1 font-bold md:mb-6">
                <span className="text-2xl md:text-3xl">{props.product_item_name}</span>
                <span className="text-2xl md:text-5xl" >P{props.product_item_price?.toString()}</span>
                </div>

                {/* t-shirt sizes */}
                <div>
                    <span className="font-bold text-md">Size</span>
                    <div className="flex gap-2">
                    {
                    ["XS", "S", "M", "L", "XL", "OS"].map((size, i) => (
                    <button key={i} className="font-regular text-xs mt-1 cursor-pointer rounded-sm w-10 py-2 bg-card-black-background text-white dark:bg-card-white-background dark:text-black">{size}</button>
                    ))}
                    </div>
                </div>

                {/* minus and add buttons */}
                <div className="flex sm:justify-center md:justify-start gap-1"><MinusAddButtons style="text-center font-regular text-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black py-1 w-full md:w-auto md:px-6 rounded-sm"/></div>

                {/* add-to-cart and buy now buttons */}
                <div className="flex sm:justify-center md:justify-start gap-1"><AddToCartAndBuyNowButtons/></div>
            </div>
        </div>
        </>
        ) : (
            <span>Loading...</span>
        )}
        </>
    );
}