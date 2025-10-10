
"use client"
import Image from "next/image";
import { Card } from "../carousel/card";
import useGetCart from "@/hooks/useGetCart";
import React, { useEffect, useMemo } from "react";
import { computeItems } from "@/lib/helper/compute-items";
import useDeleteCart from "@/hooks/useDeleteCart";
import { useCheckoutModal } from "@/lib/store/checkout-items";

export default function CheckoutItemData(){
    const { data } = useGetCart();
    const { setComputeItems,  } = useCheckoutModal();
    const shippingFee = "105"

    const res = useMemo(() => {
        if (!data || data.length === 0) {
          return {
            subTotalPriceResult: 0,
            overallQtyResult: 0,
            overallPriceResult: 0,
          };
        }
        
        return computeItems(data, shippingFee);
      }, [data, shippingFee]);
      
      useEffect(() => {
        if(data && data.length > 0){
          setComputeItems(res);
        }
      }, [data, res, setComputeItems]);

      const { mutate: deleteData } = useDeleteCart();
      

    return (
    <>
        <Card className="h-auto rounded-md mt-6 gap-3 dark:bg-card-black-background px-8 py-5">
        {data?.length! > 0 ? (
        <>
            {data?.map((item: CartItemsProps, index: number) => (
                <React.Fragment key={index}>
                    {/* tshirt image, name, qty, size and price container*/}
                    <div className="flex flex-col md:flex-row items-center space-x-4 text-sm relative">
            
                        {/* tshirt image */}
                        <div className="h-30 w-50 relative">
                        <Image className="object-contain" src={item?.cart_item_image ?? "/images/png/tshirt_placeholder.png"}
                        priority fill alt="checkout-tshirt-image"/>
                        </div>

                        {/* name, qty and size */}
                        <div className="flex mt-2 md:mt-0 justify-between w-full">
                            <div className="flex space-x-2 md:flex-col md:space-x-0">
                                <div className="space-x-1">
                                    <span className="capitalize">{item?.cart_item_name}</span>
                                    <span>x{item?.cart_item_qty}</span>
                                </div>
                                <span>{item?.cart_item_size}</span>
                            </div>

                            {/* price */}
                            <div>
                                P{item?.cart_item_price}
                                <button className="text-black dark:text-white font-bold cursor-pointer absolute top-0 right-0"
                                onClick={() => deleteData(item?.cart_item_ID.toString())}>x</button>
                                </div>
                        </div>
                            

                    </div>
                    <hr className="border-black dark:border-white border-t-2"/>
                    
                </React.Fragment>))}
                    { /* subtotal, shipping and total prices container */}
                    <div className="space-y-4">

                        {/* subtotal and shipping price */}
                        <div className="space-y-1 text-sm">
                        
                            <div className="flex justify-between">
                                <span>Subtotal - {res.overallQtyResult} Items</span>
                                <span>P{res.subTotalPriceResult.toLocaleString("en-Ph")}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>P{shippingFee}</span>
                            </div>

                        </div>

                        {/* total price*/}
                        <div className="text-md flex justify-between">
                            <span>Total</span>
                            <span><span className="dark:text-slate-200 text-xs">PHP</span>{res.overallPriceResult.toLocaleString("en-Ph")}</span>
                        </div>
                    
                    </div>
        </> ) : (
           <div className="h-auto md:h-100 flex items-center justify-center">Your cart is currently empty</div>
        )}
        </Card>
    </>
    );
}