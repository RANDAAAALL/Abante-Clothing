"use client"

import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../carousel";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../card";
import Image from "next/image";
import { CustomerFeedbackValue } from "@/lib/values-type/customer-feedback-value";

export default function CustomerImageDescContent(){
    const { plugin, pluginStop, pluginReset } = useAutoPlayCarousel();

    return (
    <>
    <Carousel className=" font-bold w-full max-w-xs md:max-w-xl lg:max-w-4xl" opts={{
      align: "start",
      loop: true,
      skipSnaps: false,
    }}
      plugins={[plugin.current]}
      onMouseEnter={pluginStop}
      onMouseLeave={pluginReset}>
      <CarouselContent>
        {CustomerFeedbackValue.map((customer, index) => (
          <CarouselItem key={index}>
            <div className="p-0 h-full">
              <Card className="relative h-full flex flex-col justify-between">

                {/* customer image and name*/}
                <CardHeader>
                <CardTitle className="flex flex-col items-center gap-4">
                <Image className="rounded-full border-white shadow-lg "
                src={customer.imagePath}
                width={120}
                height={50}
                alt={customer.imageAlt}/>
                
                <p className="font-bold mt-2">{customer.name}</p>
                </CardTitle>
                </CardHeader>

                 {/* customer feedback */}
                {/*  <Image src={customer.path} width={250} height={250} className="" alt={tshirt.alt}/> */}
                <CardContent className="font-normal text-center py-3 my-4">
                <div className="p-0">
                {customer.feedback}
                </div>
                <Image
                className="absolute top-55 left-5"
                src={customer.quoteUpIconPath}
                width={15}
                height={15}
                alt={customer.quoteUpIconAlt}/>

                <Image
                className="absolute bottom-20 right-5"
                src={customer.quoteDownIconPath}
                width={15}
                height={15}
                alt={customer.quoteDownIconAlt}/>
              
                </CardContent>

                 {/* customer rating */}
                <CardFooter className="flex ">
                <Image
                src={customer.starRatingWithColorIconPath}
                width={20}
                height={20}
                alt={customer.starRatingWithColorIconAlt}/>

                <Image
                src={customer.starRatingWithoutColorIconPath}
                width={20}
                height={20}
                alt={customer.starRatingWithoutColorIconAlt}/>
                </CardFooter>

              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious  className="hidden md:flex " />
      <CarouselNext  className="hidden md:flex"/>
    </Carousel>
        </>
    );
}