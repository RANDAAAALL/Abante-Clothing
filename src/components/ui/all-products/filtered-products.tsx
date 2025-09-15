
import Link from "next/link";
import { Card, CardContent, CardFooter } from "../carousel/card";
import Image from "next/image";
import { TshirtType } from "@/lib/types/t-shirt-types";

export default function AllFilteredProducts({ props }: { props: TshirtType[]}){
    return (
        <>
            {props.map((item, _ ) => (
                <Link key={item.product_item_ID} href={`/products/${item.product_item_name}`}>

                    {/* card container */}
                    <Card className="w-full items-center">

                        {/* card body content */}
                        <CardContent className="flex aspect-square items-center">
                            <Image 
                            src={item.product_item_image ?? "t-shirt-not-found"}
                            height={200}
                            width={200}
                            alt={item.alt ?? "tshirt-alt"}/>
                        </CardContent>
                    
                        {/* card footer  */}
                        <CardFooter className="w-full justify-between">
                            <span>{item.product_item_name?.toUpperCase()}</span>
                            <span>P{item.product_item_price?.toString()}</span>
                        </CardFooter>

                    </Card>
            
                </Link>
            ))}
        </>
    );
}