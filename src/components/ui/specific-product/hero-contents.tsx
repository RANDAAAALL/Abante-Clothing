"use client";
import { TshirtType } from "@/lib/types/t-shirt-types";
import Image from "next/image";
import QuantityButtons from "./quantity-buttons";
import AddToCartAndBuyNowButtons from "./atc-and-bn-buttons";
import { ProductProps } from "@/lib/types/product-types";
import TshirtSizesButtons from "./sizes-buttons";
import { usePhotoModal } from "@/lib/store/product-photos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
    const pathname = usePathname();
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const colorParam = useSearchParams().get("color");
    const currentPhoto = props[selectedIndex];
    const memoizedPhoto = useMemo(() => currentPhoto, [currentPhoto]);
    
    // on first load
    // it will extract and set the current index and color of value from the props
    useEffect(() => {
      if (pathname.includes("/photo/")) return;
      
      const defaultColor = props[0]?.product_item_color ?? "";
      if (!colorParam) {

        // prevent redundant replace if already correct
        if (!window.location.search.includes(`color=${defaultColor}`)) {
          router.replace(`/products/${slug}?color=${encodeURIComponent(defaultColor)}`, { scroll: false });
        }
        setSelectedIndex(0);
        setSelectedColor(defaultColor);
        return;
      }
    
      const index = props.findIndex(
        (p) => p.product_item_color?.toLowerCase() === colorParam.toLowerCase()
      );
    
      if (index !== -1) {
        setSelectedIndex(index);
        setSelectedColor(props[index].product_item_color ?? "");
      } else {
        if (!window.location.search.includes(`color=${defaultColor}`)) {
          router.replace(`/products/${slug}?color=${encodeURIComponent(defaultColor)}`, { scroll: false });
        }
        setSelectedIndex(0);
        setSelectedColor(defaultColor);
      }
    }, [colorParam, props, router, slug, setSelectedColor, pathname]);
    
    const photos = [
      { src: memoizedPhoto.product_item_image, type: "front", alt: `${memoizedPhoto.product_item_ID}-front`},
      { src: memoizedPhoto.product_item_back_image, type: "back", alt: `${memoizedPhoto.product_item_ID}-back`},
      { src: "/images/png/abante-t-shirt-size-chart-image.png", type: "size-chart", alt: "size-chart"},
    ];

  return (
    <>
      {currentPhoto ? (
        <>
          <div className="flex flex-col md:flex-row gap-0 sm:gap-5">
           
            {/* photos container */}
            <div className="flex flex-row justify-center items-center gap-0 sm:gap-5 relative">

                {/* sub-photos */}
                  <div className="flex flex-col space-y-3 justify-center items-center">
                    {photos.map((photo, i) => (
                      <button
                        key={i}
                        className="relative w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]"
                        onClick={() => {router.push(`/products/${slug}/photo/${photo.type}${photo.type !== "size-chart" ? `?color=${memoizedPhoto.product_item_color}`: ""}`,{ scroll: false });
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
                  <div>
                    <button
                      onClick={() => {router.push(`/products/${slug}/photo/main?color=${memoizedPhoto.product_item_color}`, { scroll: false});
                      openPhotoModal()}}
                      className="cursor-pointer">
                      <Image
                      src={memoizedPhoto.product_item_image!}
                      alt={`${memoizedPhoto.product_item_ID}-main`}
                      width={350}
                      height={350}
                      priority
                      className="object-contain"/>
                    </button>

                    {/* color picker */}
                    <div className="absolute bottom-6 right-4 flex space-x-3 z-[10]">
                      {props.map((variant, i) => (
                      <button
                      key={i}
                      onClick={() => {
                        setSelectedIndex(i);
                        setSelectedColor(variant.product_item_color ?? "");
                      
                        // update URL without triggering a server fetch
                        const url = `/products/${slug}?color=${encodeURIComponent(variant.product_item_color!)}`;
                        window.history.replaceState(null, "", url);
                      }}
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
                  
                  <div className="flex justify-between md:items-start flex-col md:gap-1 font-bold md:mb-0">
                  {/* FIRST ROW */}
                  <div className="flex justify-between items-center md:flex-col  md:items-start">

                    {/* NAME */}
                    <span className="text-2xl md:text-3xl capitalize">
                      {memoizedPhoto.product_item_name}
                    </span>

                    {/* PRICE GROUP */}
                    <div className="flex items-center space-x-1 md:flex-row md:items-center md:space-x-2">

                      {/* ORIGINAL PRICE */}
                      <span
                        className={`text-xl md:text-3xl ${
                          memoizedPhoto.product_item_discount! > 0 ? "line-through" : ""
                        }`}
                      >
                       P{memoizedPhoto.product_item_price}
                      </span>

                      {/* DISCOUNTED PRICE + % */}
                      {memoizedPhoto.product_item_discount! > 0 && (
                        <>
                          <span className="text-lg md:text-3xl">-</span>
                          <span className="text-xl md:text-3xl">
                            P{(
                              memoizedPhoto.product_item_price! *
                              (1 - memoizedPhoto.product_item_discount! / 100)
                            ).toFixed(0)}
                          </span>

                          <span className="text-md md:text-lg">
                            -{memoizedPhoto.product_item_discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* STOCK */}
                  <span className="text-lg">
                    {memoizedPhoto.product_item_stock === 0
                      ? "Out of Stock"
                      : `${memoizedPhoto.product_item_stock}${
                          memoizedPhoto.product_item_stock === 1 ? "pc" : "pcs"
                        }`}
                  </span>

                  </div>

                  {/* t-shirt sizes */}
                  <TshirtSizesButtons 
                  product_item_stock={memoizedPhoto.product_item_stock}
                  productID={memoizedPhoto.product_item_ID}
                  currentSizes={memoizedPhoto.product_item_size} />

                  {/* quantity buttons */}
                  <div className="flex w-full sm:justify-center md:justify-start gap-1">
                    <QuantityButtons 
                    product_item_stock={memoizedPhoto.product_item_stock}
                    productID={memoizedPhoto.product_item_ID}
                    style="text-center font-regular text-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black py-1 w-full md:w-auto md:px-6 rounded-sm" />
                  </div>

                  {/* add-to-cart and buy now buttons */}
                  <div className="flex w-full sm:justify-center md:justify-start gap-1">
                    <AddToCartAndBuyNowButtons product_item_stock={memoizedPhoto.product_item_stock} props={memoizedPhoto} />
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
