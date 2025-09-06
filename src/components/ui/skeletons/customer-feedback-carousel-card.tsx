import { Carousel, CarouselContent, CarouselItem } from "../carousel/carousel";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../carousel/card";

export default function CustomerFeedbackCarouselSkeleton() {
  return (
    <Carousel className="font-bold w-full max-w-xs md:max-w-xl lg:max-w-4xl">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, i) => (
          <CarouselItem key={i}>
            <div className="p-0 h-full">
              <Card className="relative h-full flex flex-col justify-between dark:bg-card-black-background bg-white shadow-md">
                
                {/* customer image and name */}
                <CardHeader>
                  <CardTitle className="flex flex-col items-center gap-4">
                    <div className="rounded-full h-30 w-[120] customer-feedback-skeleton"></div>
                    <div className="mt-2 h-4 w-30 rounded customer-feedback-skeleton"></div>
                  </CardTitle>
                </CardHeader>

                {/* feedback text */}
                <CardContent className="font-normal py-3 my-4 flex flex-col justify-left gap-2">
                  <div className="h-3 w-full rounded customer-feedback-skeleton"></div>
                  <div className="h-3 w-full rounded customer-feedback-skeleton"></div>
                  <div className="h-3 w-2/3 rounded customer-feedback-skeleton"></div>
                </CardContent>

                {/* rating stars */}
                <CardFooter className="flex justify-left">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-6 w-6 rounded star-skeleton"></div>
                  ))}
                </CardFooter>

              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
