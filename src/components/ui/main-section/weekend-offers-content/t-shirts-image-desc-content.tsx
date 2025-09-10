"use client"

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../../carousel/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/carousel/card"
import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";
import { TshirtType } from "@/lib/types/t-shirt-types";
import Link from "next/link";
import { ProductProps } from "@/lib/types/product-types";

// flag: means to determined which kind of component is being used
// flag = true -> it used for src/app/components/ui/weekend-offer-content/weekend-offers.tsx
// flag = false -> it used for src/app/components/ui/specific-product/customer-product-preview.tsx
export default function TshirtsImageDescContent<T extends TshirtType | TshirtType[]>(
    { props, flag} : { props: ProductProps<T>, flag: boolean } 
    ){
    const { plugin, pluginStop, pluginReset } = useAutoPlayCarousel();
    const list: TshirtType | TshirtType[] = Array.isArray(props) ? props : [props]; 

    return (
    <>
    <Carousel className={`${flag && "mt-3 px-5 mx-auto md:flex-start md:justify-start"} font-bold w-full max-w-xs md:max-w-xl lg:max-w-4xl xl:max-w-none'}`} opts={{
      align: "start",
      loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={pluginStop}
      onMouseLeave={pluginReset}>
      <CarouselContent>
        {list.map(( tshirt , _ ) => (
          <CarouselItem key={tshirt?.product_item_ID}>

            {!flag ? ( 
            <Link href={`products/${tshirt?.product_item_name}`} onClick={() => console.log("CLICKED: ", tshirt)} className="p-0">
              <Card className=" dark:bg-card-black-background">
                <CardHeader>
                  {!flag && <CardTitle className="text-right">-{tshirt?.discount?.toString()}%</CardTitle>}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center">
                <Image
                src={tshirt?.product_item_image ?? "t-shirt not found"}
                width={250}
                height={250}
                alt={tshirt?.alt ?? "t-shirt alt"}/>
                </CardContent>
                <CardFooter className="justify-between">
                    <div>{tshirt?.product_item_name?.toUpperCase()}</div>
                    <div>P{tshirt?.product_item_price}</div>
                </CardFooter>
              </Card>
            </Link>
            ) : (
              <Card className=" dark:bg-card-black-background">
                <CardHeader>
                  {!flag && <CardTitle className="text-right">-{tshirt?.discount}%</CardTitle>}
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center">
                <Image
                src={tshirt?.product_item_image ?? ""}
                width={250}
                height={250}
                alt={tshirt.alt ?? "t-shirt not found"}/>
                </CardContent>
                <CardFooter className="justify-between">
                    <div>{tshirt?.product_item_name?.toUpperCase()}</div>
                    <div>P{tshirt?.product_item_price}</div>
                </CardFooter>
              </Card>
            )}

          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant={"ghost"} className={`hidden ${!flag ? 'md:flex' : 'sm:flex'}`} />
      <CarouselNext variant={"ghost"}  className={`hidden ${!flag ? 'md:flex' : 'sm:flex'}`}/>
    </Carousel>
    </>
    );
}