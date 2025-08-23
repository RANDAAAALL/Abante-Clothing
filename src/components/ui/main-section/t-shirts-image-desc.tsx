import { TshirtValue } from "@/lib/values-type/t-shirt-value";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/main-section/card"

export default function TshirtsImageDescContent(){
    return (
    <>
    <Carousel className="w-full max-w-sm md:max-w-xl lg:max-w-4xl xl:max-w-none" opts={{
        align: "start",
        loop: true,
    }}>
      <CarouselContent>
        {TshirtValue.map((tshirt, index) => (
          <CarouselItem key={index}>
            <div className="p-0">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center">
                <Image src={tshirt.path} width={250} height={250} className="" alt={tshirt.alt}/>
                </CardContent>
                <CardFooter className="font-bold justify-between">
                    <div>{tshirt.name} - {tshirt.size}</div>
                    <div>P{tshirt.price}</div>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </>
    );
}