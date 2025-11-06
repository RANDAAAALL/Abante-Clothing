
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../carousel/card";
import Image from "next/image";
import { TshirtType } from "@/lib/types/t-shirt-types";
import React from "react";

export default function AllFilteredProducts({ props }: { props: TshirtType[]}){
    return (
        <React.Fragment>
            {props.map((item, _ ) => (
                <Link key={item.product_item_ID} href={`/products/${item.product_item_name}`}>

                    {/* card container */}
                    <Card className="md:h-[360px] gap-0 pb-2 flex flex-col justify-between hover:shadow-md hover:dark:shadow-[#343333] dark:bg-card-black-background">
                        <CardHeader>
                            <CardTitle className="text-right">
                                {item?.product_item_discount ? `-${item?.product_item_discount}%` : ""}
                            </CardTitle>
                        </CardHeader>

                        {/* card body content */}
                        <CardContent className="relative w-full aspect-square flex items-center justify-center">
                            <Image 
                            src={item.product_item_image ?? "t-shirt-not-found"}
                            style={{ objectFit: 'contain', padding: 15}}
                            // sizes="auto"
                            fill
                            priority={true}
                            alt={item.alt ?? "tshirt-alt"}/>
                        </CardContent>
                    
                        {/* card footer  */}
                        <CardFooter className="justify-between min-h-[50px]">
                            <span>{item.product_item_name?.toUpperCase()}</span>
                            <span>P{item.product_item_price?.toString()}</span>
                        </CardFooter>

                    </Card>
            
                </Link>
            ))}
        </React.Fragment>
    );
}