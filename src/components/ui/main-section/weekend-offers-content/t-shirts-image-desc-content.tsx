"use client"

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../../carousel/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/carousel/card"
import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";
import { TshirtType } from "@/lib/types/t-shirt-types";
import Link from "next/link";

export default function TshirtsImageDescContent({ tshirt }:{ tshirt?: TshirtType[]}){
    const { plugin, pluginStop, pluginReset } = useAutoPlayCarousel();

    return (
    <>
    <Carousel className="font-bold w-full max-w-xs md:max-w-xl lg:max-w-4xl xl:max-w-none" opts={{
      align: "start",
      loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={pluginStop}
      onMouseLeave={pluginReset}>
      <CarouselContent>
        {tshirt?.map(( tshirt , _ ) => (
          <CarouselItem key={tshirt.product_item_ID}>
            <Link href={`products/${tshirt.product_item_name}`} onClick={() => console.log("CLICKED: ", tshirt)} className="p-0">
              <Card className=" dark:bg-card-black-background">
                <CardHeader>
                  <CardTitle className="text-right">-{tshirt.discount as number}%</CardTitle>
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center">
                <Image
                src={tshirt.product_item_image ?? ""}
                width={250}
                height={250}
                alt={`${tshirt.product_item_name}-${tshirt.product_item_ID}`}/>
                </CardContent>
                <CardFooter className="justify-between">
                    <div>{tshirt.product_item_name?.toUpperCase()} - {tshirt.product_item_size!.split(/\s+/)[0]}</div>
                    <div>{tshirt.product_item_price as number}</div>
                </CardFooter>
              </Card>
            
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious variant={"ghost"} className="hidden md:flex bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 hover:bg-transparent" />
      <CarouselNext variant={"ghost"}  className="hidden md:flex bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 hover:bg-transparent"/>
    </Carousel>
    </>
    );
}