"use client";

import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../../carousel/carousel";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../carousel/card";
import Image from "next/image";
import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import CustomerFeedbackRating from "../../customer-feedback-rating";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerImageDescContent({ customerFeedback }: { customerFeedback: CustomerFeedbackProps[] }) {
  const { plugin, pluginStop, pluginReset } = useAutoPlayCarousel();
  const router = useRouter();
  
   // Auto-refresh every 30s
   useEffect(() => {
    router.refresh();
    const interval = setInterval(() => {
      console.log("Customer feedbacks data refreshed");
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <Carousel
      className="font-bold w-full max-w-xs md:max-w-xl lg:max-w-4xl"
      opts={{
        align: "start",
        loop: true,
        skipSnaps: false,
      }}
      plugins={[plugin.current]}
      onMouseEnter={pluginStop}
      onMouseLeave={pluginReset}
    >
      <CarouselContent>
        {customerFeedback &&
          customerFeedback.map((customer, index) => (
            <CarouselItem key={index}>
              <div className="p-0 h-full">
                <Card className="relative h-full flex flex-col justify-between dark:bg-card-black-background">
                  
                  {/* Avatar + Name */}
                  <CardHeader className="flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4shadow-md">
                      <Image
                        src={customer?.users?.user_image ?? "/images/png/default_avatar.png"}
                        alt="customer-avatar"
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"/>
                    </div>
                    <p className="font-bold">{customer?.users?.username ?? "Anonymous"}</p>
                  </CardHeader>

                  {/* Feedback Text */}
                  <CardContent className="flex-1 flex items-center justify-center text-center px-4">
                    <p className="text-sm font-normal leading-relaxed">
                      <span className="font-black text-xl">&ldquo;</span>
                      {" "}
                      {customer?.feedback_comment}
                      {" "}
                      <span className="font-black text-xl">&rdquo;</span>
                    </p>
                  </CardContent>

                  {/* Rating */}
                  <CardFooter className="flex justify-center md:justify-start pb-4">
                    <CustomerFeedbackRating rating={customer?.feedback_rating} />
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>

      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
}
