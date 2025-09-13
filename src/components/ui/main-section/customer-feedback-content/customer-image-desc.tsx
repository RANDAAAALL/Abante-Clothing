"use client"

import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../carousel/carousel";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../carousel/card";
import Image from "next/image";
import QuotesUpIcon from "./quotes-up-icon";
import QuotesDownIcon from "./quotes-down-icon";
import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import CustomerFeedbackRating from "../../customer-feedback-rating";

export default function CustomerImageDescContent({ customerFeedback }: { customerFeedback: CustomerFeedbackProps[]}){
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
        {customerFeedback && customerFeedback.map((customer, index) => (
          <CarouselItem key={index}>
            <div className="p-0 h-full">
              <Card className="relative h-full flex flex-col justify-between dark:bg-card-black-background">

                {/* customer image and name*/}
                 <CardHeader>
                    <CardTitle className="flex flex-col items-center gap-4">
                      <Image className="rounded-full border-white shadow-lg "
                      src={customer?.users?.user_image ?? "/images/png/default_avatar.png"}
                      width={120}
                      height={50}
                      alt="customer-feedback-alt"/>
                      
                      <p className="font-bold mt-2">{customer?.users?.username ?? "Anonymous"}</p>
                    </CardTitle>
                  </CardHeader>

                  {/* customer feedback */}
                  <CardContent className="font-normal py-3 my-4">
                    <p className="text-sm">
                    {customer?.feedback_comment}
                    </p>
                    <QuotesUpIcon />
                    <QuotesDownIcon />
                
                  </CardContent>

                  {/* customer rating */}
                <CardFooter>
                  <CustomerFeedbackRating rating={customer?.feedback_rating} />
                </CardFooter>

              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex "/>
    </Carousel>
        </>
    );
}