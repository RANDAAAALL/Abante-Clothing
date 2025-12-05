"use client";
import { TshirtType } from "@/lib/types/t-shirt-types";
import Image from "next/image";
import QuantityButtons from "./quantity-buttons";
import AddToCartAndBuyNowButtons from "./atc-and-bn-buttons";
import { ProductProps } from "@/lib/types/product-types";
import TshirtSizesButtons from "./sizes-buttons";
import { usePhotoModal } from "@/lib/store/product-photos";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useCartItems } from "@/lib/store/cart-items";

interface HeroContentsProps {
  props: ProductProps<Partial<TshirtType>[]>;
  slug: string;
  selectedColors?: string[]; 
}

export default function HeroContents({ props, slug, selectedColors = [] }: HeroContentsProps) {
  const { openPhotoModal } = usePhotoModal();
  const { setSelectedColor } = useCartItems();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // get color from selectedColors prop first, then from URL
  const initialColor = selectedColors.length > 0 
    ? selectedColors[0] 
    : searchParams.get("color");
  
  // find initial index efficiently
  const initialIndex = useMemo(() => {
    if (initialColor) {
      return props.findIndex(
        p => p.product_item_color?.toLowerCase() === initialColor.toLowerCase()
      );
    }
    return 0;
  }, [initialColor, props]);
  
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
  const currentPhoto = props[selectedIndex] || props[0];
  
  // Optimized: Only run once on mount
  useEffect(() => {
    if (pathname.includes("/photo/")) return;
    
    const defaultColor = props[0]?.product_item_color ?? "";
    const currentColor = searchParams.get("color");
    
    // only update URL if it doesnt match
    if (!currentColor || currentColor !== defaultColor) {
      const newUrl = `/products/${slug}?color=${encodeURIComponent(defaultColor)}`;
      
      // use replaceState for instant update without navigation
      window.history.replaceState({}, "", newUrl);
      setSelectedColor(defaultColor);
    }
  // run only once on mount
  }, []); 

  // Optimized color change handler
  const handleColorChange = useCallback((index: number) => {
    const variant = props[index];
    if (!variant?.product_item_color) return;
    
    setSelectedIndex(index);
    setSelectedColor(variant.product_item_color);
    
    // update URL without navigation
    const url = `/products/${slug}?color=${encodeURIComponent(variant.product_item_color)}`;
    window.history.replaceState(null, "", url);
  }, [props, slug, setSelectedColor]);

  // memoize photos array
  const photos = useMemo(() => {
    return [
      { 
        src: currentPhoto.product_item_image, 
        type: "front" as const, 
        alt: `${currentPhoto.product_item_ID}-front`
      },
      { 
        src: currentPhoto.product_item_back_image, 
        type: "back" as const, 
        alt: `${currentPhoto.product_item_ID}-back`
      },
      { 
        src: "/images/png/abante-t-shirt-size-chart-image.png", 
        type: "size-chart" as const, 
        alt: "size-chart"
      },
    ];
  }, [currentPhoto]);

  // memoize photo modal handler
  const handlePhotoClick = useCallback((type: string) => {
    const url = `/products/${slug}/photo/${type}${
      type !== "size-chart" ? `?color=${currentPhoto.product_item_color}` : ""
    }`;
    router.push(url, { scroll: false });
    openPhotoModal();
  }, [slug, currentPhoto.product_item_color, router, openPhotoModal]);

  // memoize main photo click handler
  const handleMainPhotoClick = useCallback(() => {
    const url = `/products/${slug}/photo/main?color=${currentPhoto.product_item_color}`;
    router.push(url, { scroll: false });
    openPhotoModal();
  }, [slug, currentPhoto.product_item_color, router, openPhotoModal]);

  return (
    <>
      {currentPhoto ? (
        <div className="flex flex-col md:flex-row gap-0 sm:gap-5">
          {/* photos container */}
          <div className="flex flex-row justify-center items-center gap-0 sm:gap-5 relative">
            {/* sub-photos */}
            <div className="flex flex-col space-y-3 justify-center items-center">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  className="relative w-[90px] h-[90px] sm:w-[120px] sm:h-[120px]"
                  onClick={() => handlePhotoClick(photo.type)}
                >
                  <Image
                    src={photo.src!}
                    alt={photo.alt}
                    fill
                    priority
                    style={{ objectFit: "contain" }}
                    sizes="auto"
                  />
                </button>
              ))}
            </div>

            {/* main photo image */}
            <div>
              <button
                onClick={handleMainPhotoClick}
                className="cursor-pointer"
              >
                <Image
                  src={currentPhoto.product_item_image!}
                  alt={`${currentPhoto.product_item_ID}-main`}
                  width={350}
                  height={350}
                  priority
                  className="object-contain"
                />
              </button>

              {/* color picker */}
              <div className="absolute bottom-6 right-4 flex space-x-3 z-[10]">
                {props.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => handleColorChange(i)}
                    className={`h-3 w-3 rounded-full border-2 transition-all duration-150
                      ${i === selectedIndex
                        ? "ring-2 ring-offset-2 ring-black dark:ring-white ring-offset-white dark:ring-offset-black" 
                        : "hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500"}`}
                    style={{backgroundColor: variant.product_item_color || "gray"}}
                    aria-label={`Select ${variant.product_item_color} color`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* tshirt title, price and buttons container */}
          <div className="flex flex-col justify-center w-full gap-3 md:w-md">
            <div className="flex justify-between md:items-start flex-col md:gap-1 font-bold md:mb-0">
              {/* FIRST ROW */}
              <div className="flex justify-between items-center md:flex-col md:items-start">
                {/* NAME */}
                <span className="text-2xl md:text-3xl capitalize">
                  {currentPhoto.product_item_name}
                </span>

                {/* PRICE GROUP */}
                <div className="flex items-center space-x-1 md:flex-row md:items-center md:space-x-2">
                  {/* ORIGINAL PRICE */}
                  <span
                    className={`text-xl md:text-3xl ${
                      currentPhoto.product_item_discount! > 0 ? "line-through" : ""
                    }`}
                  >
                    P{currentPhoto.product_item_price}
                  </span>

                  {/* DISCOUNTED PRICE + % */}
                  {currentPhoto.product_item_discount! > 0 && (
                    <>
                      <span className="text-lg md:text-3xl">-</span>
                      <span className="text-xl md:text-3xl">
                        P{(
                          currentPhoto.product_item_price! *
                          (1 - currentPhoto.product_item_discount! / 100)
                        ).toFixed(0)}
                      </span>

                      <span className="text-md md:text-lg">
                        -{currentPhoto.product_item_discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* STOCK */}
              <span className="text-lg">
                {currentPhoto.product_item_stock === 0
                  ? "Out of Stock"
                  : `${currentPhoto.product_item_stock}${
                      currentPhoto.product_item_stock === 1 ? "pc" : "pcs"
                    }`}
              </span>
            </div>

            {/* t-shirt sizes */}
            <TshirtSizesButtons 
              product_item_stock={currentPhoto.product_item_stock}
              productID={currentPhoto.product_item_ID}
              currentSizes={currentPhoto.product_item_size} 
            />

            {/* quantity buttons */}
            <div className="flex w-full sm:justify-center md:justify-start gap-1">
              <QuantityButtons 
                product_item_stock={currentPhoto.product_item_stock}
                productID={currentPhoto.product_item_ID}
                style="text-center font-regular text-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black py-1 w-full md:w-auto md:px-6 rounded-sm" 
              />
            </div>

            {/* add-to-cart and buy now buttons */}
            <div className="flex w-full sm:justify-center md:justify-start gap-1">
              <AddToCartAndBuyNowButtons 
                product_item_stock={currentPhoto.product_item_stock} 
                props={currentPhoto} 
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[500px] flex items-center justify-center">
          <span className="text-gray-500">Loading product...</span>
        </div>
      )}
    </>
  );
}