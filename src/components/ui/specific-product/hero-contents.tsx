"use client";

import { TshirtType } from "@/lib/types/t-shirt-types";
import Image from "next/image";
import QuantityButtons from "./quantity-buttons";
import AddToCartAndBuyNowButtons from "./atc-and-bn-buttons";
import { ProductProps } from "@/lib/types/product-types";
import TshirtSizesButtons from "./sizes-buttons";
import Link from "next/link";
import { usePhotoModal } from "@/lib/store/product-photos";
import { useRouter } from "next/navigation";

export default function HeroContents({
  props,
  slug
}: {
  props: ProductProps<Partial<TshirtType>>,
  slug: string}) {
    const { openPhotoModal } = usePhotoModal();
    const router = useRouter();

  return (
    <>
      {props && props.product_item_image && props.product_item_back_image ? (
        <>
          <div className="flex flex-col md:flex-row gap-5">
            {/* container */}
            <div className="flex gap-6 justify-center items-center">
              {/* photos */}
              <div className="flex flex-col justify-center gap-3">
                {[
                  {
                    src: props.product_item_image,
                    type: "front",
                    alt: `${props.product_item_ID}-${props.product_item_image}`,
                  },
                  {
                    src: props.product_item_back_image,
                    type: "back",
                    alt: `${props.product_item_ID}-${props.product_item_back_image}`,
                  },
                  {
                    src: "/images/png/abante-t-shirt-size-chart-image.png",
                    type: "size-chart",
                    alt: `abante-t-shirt-size-chart alt`,
                  },
                ].map((photoLinks, index) => (
                  <Link className="relative w-[120] h-[120]" scroll={false} key={index} href={`/products/${slug}/photo/${photoLinks.type}`}
                  onClick={() => openPhotoModal()}>
                    <Image
                      src={photoLinks.src}
                      style={{ objectFit: 'contain'}}
                      sizes="auto"
                      fill
                      priority={true}
                      alt={photoLinks.alt}
                    />
                  </Link>
                ))}
              </div>

              {/* main photo */}
              <button onClick={() => { router.push(`/products/${slug}/photo/main`, { scroll: false}); openPhotoModal()}}
                  className="cursor-pointer relative w-[378] h-[378]">
                  <Image
                  src={props.product_item_image}
                  style={{ objectFit: 'contain'}}
                  sizes="auto"
                  fill
                  priority={true}
                  alt={`${props.product_item_ID}-${props.product_item_image}`}/>
              </button>
            </div>

            {/* container */}
            <div className="flex flex-col gap-3 md:w-md">
              {/* t-shirt title and price */}
              <div className="flex flex-row justify-between items-center md:items-start md:flex-col capitalize md:gap-1 font-bold md:mb-6">
                <span className="text-2xl md:text-3xl">{props.product_item_name}</span>
                <span className="text-2xl md:text-5xl">P{props.product_item_price?.toString()}</span>
              </div>

              {/* t-shirt sizes */}
              <TshirtSizesButtons />

              {/* quantity buttons */}
              <div className="flex w-full sm:justify-center md:justify-start gap-1">
                <QuantityButtons style="text-center font-regular text-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black py-1 w-full md:w-auto md:px-6 rounded-sm" />
              </div>

              {/* add-to-cart and buy now buttons */}
              <div className="flex w-full sm:justify-center md:justify-start gap-1">
                <AddToCartAndBuyNowButtons props={props} />
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
