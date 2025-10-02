"use client";
// src\app\products\[slug]\@modal\(..)photo\[imageId]\page.tsx
import { usePhotoModal } from "@/lib/store/product-photos";
import { PhotoParamsProps } from "@/lib/types/photo-params-types";
import Image from "next/image";
import { useEffect, use } from "react";

export default function PhotoModal({ params }: PhotoParamsProps) {
  const { slug, photoSlug } = use(params);
  const { isOpen, closePhotoModal } = usePhotoModal();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 md:p-0"
    onClick={() => { 
      closePhotoModal();
      history.back();
    }}>
      <div className="relative w-[500] h-[500]">
          <Image
          src={photoSlug === "back" ? 
          `${`https://res.cloudinary.com/abante-clothing/image/upload/abante-tshirts/abante-t-shirt-${slug}-back-image.png`}` :
          photoSlug === "size-chart" ?
          `${`/images/png/abante-t-shirt-size-chart-image.png`}` :
          `${`https://res.cloudinary.com/abante-clothing/image/upload/v1759378284/abante-tshirts/abante-t-shirt-${slug}.png`}`}
            style={{ objectFit: 'contain'}}
            sizes="auto"
            fill
            priority={true}
            alt={`${slug}-${photoSlug}`}/>
          {/* <button className="cursor-pointer absolute top-25 right-3 md:right-0 text-white font-bold text-xl"
            onClick={() => { 
              closePhotoModal();  
              history.back();
            }}>
            x
          </button> */}
      </div>
    </div>
  );
}
