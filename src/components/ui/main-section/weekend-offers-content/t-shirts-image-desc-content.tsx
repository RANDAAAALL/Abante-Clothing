"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../../carousel/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/carousel/card";
import useAutoPlayCarousel from "@/hooks/useAutoPlayCarousel";
import { TshirtType } from "@/lib/types/t-shirt-types";
import Link from "next/link";
import { ProductProps } from "@/lib/types/product-types";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// flag: means to determined which kind of component is being used
// flag = true -> it used for src/app/components/ui/specific-product/customer-product-preview.tsx
// flag = false -> it used for src/app/components/ui/weekend-offer-content/weekend-offers.tsx
export default function TshirtsImageDescContent<
  T extends TshirtType | TshirtType[],
>({ props, flag }: { props: ProductProps<T>; flag: boolean }) {
  const pathname = usePathname();
  const { plugin, pluginStop, pluginReset } = useAutoPlayCarousel();
  const list: TshirtType | TshirtType[] = Array.isArray(props)
    ? props
    : [props];
  const router = useRouter();

  // Auto-refresh every 30s if flag is false
  useEffect(() => {
    if (flag) return;

    router.refresh();
    const interval = setInterval(() => {
      console.log("Weekend offers Products data refreshed");
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router, flag]);

  return (
    <>
      <Carousel
        className={`${flag ? "mt-3 mx-auto md:flex-start md:justify-start lg:max-w-[865px]" : "lg:max-w-4xl"}  font-bold w-full max-w-xs md:max-w-xl xl:max-w-none'}`}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        onMouseEnter={pluginStop}
        onMouseLeave={pluginReset}
      >
        <CarouselContent>
          {list.map((tshirt, _) => (
            <CarouselItem key={tshirt?.product_item_ID}>
              <Link
                className="p-0"
                href={`/products/${tshirt?.product_item_name}`}
                onClick={(e) => {
                  if (pathname === `/products/${tshirt?.product_item_name}`)
                    e.preventDefault();
                }}
              >
                <Card className="dark:bg-card-black-background h-[445px] gap-0 pb-2 flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-right">
                      {tshirt?.product_item_discount
                        ? `-${tshirt?.product_item_discount}%`
                        : ""}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="relative w-full aspect-square flex items-center justify-center">
                    <Image
                      src={tshirt?.product_item_image ?? "t-shirt-not-found"}
                      fill
                      style={{ objectFit: "contain", padding: 15 }}
                      sizes="auto"
                      alt={tshirt?.alt ?? "t-shirt-alt"}
                      priority
                    />
                  </CardContent>

                  <CardFooter className="justify-between min-h-[50px]">
                    <div>{tshirt?.product_item_name?.toUpperCase()}</div>
                    <div>P{tshirt?.product_item_price}</div>
                  </CardFooter>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* carousel previous and next buttons */}
        <CarouselPrevious
          variant={"ghost"}
          className={`hidden ${!flag ? "md:flex" : "sm:flex"}`}
        />
        <CarouselNext
          variant={"ghost"}
          className={`hidden ${!flag ? "md:flex" : "sm:flex"}`}
        />
      </Carousel>
    </>
  );
}
