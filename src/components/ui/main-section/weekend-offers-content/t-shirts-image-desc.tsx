"use client"

import { TshirtValue } from "@/lib/values-type/t-shirt-value";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/main-section/card"
import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";

export default function TshirtsImageDescContent(){
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
        {TshirtValue.map((tshirt, index) => (
          <CarouselItem key={index}>
            <div className="p-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">{tshirt.discount}</CardTitle>
                </CardHeader>
                <CardContent className="flex aspect-square items-center justify-center">
                <Image src={tshirt.path} width={250} height={250} className="" alt={tshirt.alt}/>
                </CardContent>
                <CardFooter className="justify-between">
                    <div>{tshirt.name} - {tshirt.size}</div>
                    <div>P{tshirt.price}</div>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious  className="hidden md:flex" />
      <CarouselNext  className="hidden md:flex"/>
    </Carousel>
    </>
    );
}