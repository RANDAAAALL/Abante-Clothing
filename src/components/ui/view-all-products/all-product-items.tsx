import { getAllProducts } from "@/data-access-layer/get-all-products";
import { Card, CardContent, CardFooter } from "../carousel/card";
import Image from "next/image";
import Link from "next/link";


export default async function AllProductItems({ query }: { query: string}){
    const items = await getAllProducts();
    const filteredItems = query ? items.filter((item, _ ) => item.product_item_name?.toLowerCase().includes(query.toLowerCase())) : items;

    return (
        <>
        <div className="font-bold grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredItems.map((item, _ ) => (
            <Link key={item.product_item_ID} href={`/products/${item.product_item_name}`}>
            <Card className="w-full items-center">

            {/* t-shirt image */}
            <CardContent className="flex aspect-square items-center">
            <Image 
            src={item.product_item_image ?? "t-shirt-not-found"}
            height={200}
            width={200}
            alt={item.alt ?? "tshirt-alt"}/>
            </CardContent>

            {/* t-shirt name and price */}
            <CardFooter className="w-full justify-between">
                <span>{item.product_item_name?.toUpperCase()}</span>
                <span>P{item.product_item_price}</span>
            </CardFooter>
            </Card>
            
            </Link>
        ))}
        </div>
        </>
    );
}