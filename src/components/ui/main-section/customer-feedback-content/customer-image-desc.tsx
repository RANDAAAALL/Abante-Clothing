"use client"

import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../carousel/carousel";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../carousel/card";
import Image from "next/image";
import { CustomerFeedbackValue } from "@/lib/values-type/customer-feedback-value";
import QuotesUpIcon from "./quotes-up-icon";
import QuotesDownIcon from "./quotes-down-icon";
import StartColorWithColor from "./star-with-color";
import StartColorWithoutColor from "./star-without-color";

export default function CustomerImageDescContent(){
    const { plugin, pluginStop, pluginReset } = useAutoPlayCarousel();

    return (
    <>
    <Carousel className="font-bold w-full max-w-xs md:max-w-xl lg:max-w-4xl" opts={{
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
              <Card className="relative h-full flex flex-col justify-between dark:bg-card bg-slight-gray-background">

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
                <CardContent className="font-normal py-3 my-4">
                <p className="text-sm">
                {customer.feedback}
                </p>
                <QuotesUpIcon />
                <QuotesDownIcon />
              
                </CardContent>

                 {/* customer rating */}
                <CardFooter className="flex ">
                <StartColorWithColor />
                <StartColorWithoutColor />
                </CardFooter>

              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious  variant={"ghost"} className="hidden md:flex bg-red border-0 shadow-none focus:outline-none focus:ring-0 hover:bg-transparent" />
      <CarouselNext  variant={"ghost"} className="hidden md:flex bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 hover:bg-transparent"/>
    </Carousel>
        </>
    );
}