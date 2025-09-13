import { Carousel, CarouselContent, CarouselItem } from "../carousel/carousel";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/carousel/card";

export default function TshirtCarouselSkeletonCard() {
  return (
    <Carousel className="font-bold w-full max-w-xs md:max-w-xl lg:max-w-4xl xl:max-w-none">
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, i) => (
          <CarouselItem key={i}>
            <Card className="dark:bg-card-background overflow-hidden">

              {/* Header */}
                <CardHeader>
                  <CardTitle>
                    <div className="t-shirt-skeleton h-5 w-12 rounded float-right"></div>
                  </CardTitle>
                </CardHeader>

              {/* Content (image placeholder) */}
              <CardContent className="flex aspect-square items-center justify-center">
                <div className="t-shirt-skeleton h-[220] w-[240] rounded-xl"></div>
              </CardContent>

              {/* Footer */}
              <CardFooter className="justify-between">
                <div className="t-shirt-skeleton h-4 w-32 rounded"></div>
                <div className="t-shirt-skeleton h-4 w-10 rounded"></div>
              </CardFooter>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
