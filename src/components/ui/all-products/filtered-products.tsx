import Link from "next/link";
import { Card, CardContent, CardFooter } from "../carousel/card";
import Image from "next/image";
import { filteredProductItems } from "@/lib/filtered-product-items";
import { SearchQuerytypes } from "@/lib/types/search-query-types";

export default async function AllFilteredProducts({query}: SearchQuerytypes){
    const filteredItems = await filteredProductItems({query});
    return (
        <>
            {filteredItems.map((item, _ ) => (
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
                            <span>P{item.product_item_price}</span>
                        </CardFooter>

                    </Card>
            
                </Link>
            ))}
        </>
    );
}