"use client";
import { TshirtType } from "@/lib/types/t-shirt-types";
import Image from "next/image";
import QuantityButtons from "./quantity-buttons";
import AddToCartAndBuyNowButtons from "./atc-and-bn-buttons";
import { ProductProps } from "@/lib/types/product-types";
import TshirtSizesButtons from "./sizes-buttons";
import { usePhotoModal } from "@/lib/store/product-photos";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartItems } from "@/lib/store/cart-items";

export default function HeroContents({
  props,
  slug
}: {
  props: ProductProps<Partial<TshirtType>[]>,
  slug: string}) {
    const { openPhotoModal } = usePhotoModal();
    const { setSelectedColor } = useCartItems();
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const colorParam = useSearchParams().get("color");
    const currentPhoto = props[selectedIndex];
    
    // on first load
    // it will extract and set the current index and color of value from the props
    useEffect(() => { 
      const defaultColor = props[0]?.product_item_color ?? "";
    
      if (!colorParam) {
        // it will set to default index and color if user typed non-existing color
        // + fix the url param
        setSelectedIndex(0);
        setSelectedColor(defaultColor);
        router.replace(`/products/${slug}?color=${encodeURIComponent(defaultColor)}`, { scroll: false });
        return;
      }
    
      const index = props.findIndex(
        (p) => p.product_item_color?.toLowerCase() === colorParam.toLowerCase()
      );
    
      if (index !== -1) {
        // if color value found in the props
        setSelectedIndex(index);
        setSelectedColor(props[index].product_item_color ?? "");
      } else {
        // otherwise set to default index and color + fix the url param
        setSelectedIndex(0);
        setSelectedColor(defaultColor);
        router.replace(`/products/${slug}?color=${encodeURIComponent(defaultColor)}`, { scroll: false });
      }
    }, [colorParam, props, router, slug, setSelectedColor]);
    

    const photos = [
      { src: currentPhoto.product_item_image, type: "front", alt: `${currentPhoto.product_item_ID}-front`},
      { src: currentPhoto.product_item_back_image, type: "back", alt: `${currentPhoto.product_item_ID}-back`},
      { src: "/images/png/abante-t-shirt-size-chart-image.png", type: "size-chart", alt: "size-chart"},
    ];

  return (
    <>
      {currentPhoto ? (
        <>
          <div className="flex flex-col md:flex-row gap-0 sm:gap-5">
           
            {/* photos container */}
            <div className="flex flex-row justify-center items-center gap-0 sm:gap-5">

                {/* sub-photos */}
                  <div className="flex flex-col space-y-3 justify-center items-center">
                    {photos.map((photo, i) => (
                      <button
                        key={i}
                        className="relative w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]"
                        onClick={() => {router.push(`/products/${slug}/photo/${photo.type}${photo.type !== "size-chart" ? `?color=${currentPhoto.product_item_color}`: ""}`,{ scroll: false });
                        openPhotoModal();}}>
                        <Image
                        src={photo.src!}
                        alt={photo.alt}
                        fill
                        priority
                        style={{ objectFit: "contain" }}
                        sizes="auto"/>
                      </button>
                    ))}
                  </div>

                  {/* main photo image */}
                  <div className="relative w-[350px] h-[350px]">
                    <button
                      onClick={() => {router.push(`/products/${slug}/photo/main?color=${currentPhoto.product_item_color}`, { scroll: false });
                      openPhotoModal()}}
                      className="cursor-pointer">
                      <Image
                      src={currentPhoto.product_item_image!}
                      alt={`${currentPhoto.product_item_ID}-main`}
                      fill
                      priority
                      sizes="auto"
                      style={{ objectFit: "contain" }}/>
                    </button>

                    {/* color picker */}
                    <div className="absolute bottom-2 right-4 flex space-x-3 z-[10]">
                      {props.map((variant, i) => (
                      <button
                      key={i}
                      onClick={() => {
                      setSelectedIndex(i);
                      console.log("selectedColor: ", variant.product_item_color)
                      setSelectedColor(variant.product_item_color ?? "");
                      router.push(`/products/${slug}/?color=${encodeURIComponent(variant.product_item_color!)}`,
                      { scroll: false })}}
                      className={`h-3 w-3 rounded-full border-2 transition-all duration-150
                        ${i === selectedIndex
                        ? "ring-2 ring-offset-2 ring-black dark:ring-white ring-offset-white dark:ring-offset-black" 
                        : "hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500"}`}
                      style={{backgroundColor: variant.product_item_color || "gray",}}/>))}
                    </div>
                  </div>
                </div>

                {/* tshirt title, price and buttons container */}
                <div className="flex flex-col justify-center w-full gap-3 md:w-md">
                  {/* t-shirt title and price */}
                  <div className="flex flex-row justify-between items-center md:items-start md:flex-col capitalize md:gap-1 font-bold md:mb-6">
                    <span className="text-2xl md:text-3xl">{props[0].product_item_name}</span>
                    <span className="text-2xl md:text-5xl">P{props[0].product_item_price?.toString()}</span>
                  </div>

                  {/* t-shirt sizes */}
                  <TshirtSizesButtons />

                  {/* quantity buttons */}
                  <div className="flex w-full sm:justify-center md:justify-start gap-1">
                    <QuantityButtons style="text-center font-regular text-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black py-1 w-full md:w-auto md:px-6 rounded-sm" />
                  </div>

                  {/* add-to-cart and buy now buttons */}
                  <div className="flex w-full sm:justify-center md:justify-start gap-1">
                    <AddToCartAndBuyNowButtons props={currentPhoto} />
                  </div>
                </div>
          </div>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </>
  );
}
