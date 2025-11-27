"use client"
import RightArrowSVG from "@/components/icons/svg/right-arrow";
import { PhotoParamsProps } from "@/lib/types/photo-params-types";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function PhotoPage({ params }: PhotoParamsProps) {
  const { slug, photoSlug } = use(params);
  const color = useSearchParams().get("color");

  const getImageSrc = () => {
    switch (photoSlug) {
      case "back":
        return `https://res.cloudinary.com/abante-clothing/image/upload/abante-tshirts/abante-t-shirt-${slug}-${color}-back-image.png`;
      case "size-chart":
        return `/images/png/abante-t-shirt-size-chart-image.png`;
      default:
        return `https://res.cloudinary.com/abante-clothing/image/upload/v1759378284/abante-tshirts/abante-t-shirt-${slug}-${color}.png`;
    }
  };

  const buttonLabel = photoSlug === "size-chart" ? "See actual product" : "Buy now";
  const buttonWidth = photoSlug === "size-chart" ? "w-53" : "w-35";

  return (
    <>
      {/* buttons */}
      <Link
        href={`/products/${slug}`}
        className={`cursor-pointer py-3 rounded-sm text-sm bg-card-black-background text-white 
          dark:bg-card-white-background dark:text-black relative z-10 flex justify-center items-center mx-auto
          ${buttonWidth} -mb-25 mt-20 space-x-1`}
      >
        <span>{buttonLabel}</span>
        <RightArrowSVG />
      </Link>

      {/* Image */}
      <div className={`relative h-screen -z-10 ${photoSlug === "size-chart" ? "mt-25" : ""}`}>
        <Image
          src={getImageSrc()}
          alt={`${slug}-${photoSlug}`}
          style={{ objectFit: "scale-down" }}
          sizes="100vw"
          fill
          priority
        />
      </div>
    </>
  );
}
