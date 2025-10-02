import RightArrowSVG from "@/components/icons/svg/right-arrow";
import { PhotoParamsProps } from "@/lib/types/photo-params-types";
import Image from "next/image";
import Link from "next/link";
import { use } from "react"; 

export default function PhotoPage({ params }: PhotoParamsProps) {
  const { slug, photoSlug } = use(params);

  return (
    <>
    <Link className={`cursor-pointer py-3 rounded-sm text-sm bg-card-black-background text-white  space-x-1
      dark:bg-card-white-background dark:text-black z-100 relative flex justify-center items-center mx-auto 
      ${photoSlug === "size-chart" ? "w-53" : "w-35"} -mb-25 mt-20`}
      href={`/products/${slug}`}>
      <span>{photoSlug === "size-chart" ? "See actual product" : "Buy now"}</span>
      <span><RightArrowSVG/></span>
    </Link>
    <div className="relative h-screen">
      <Image
        src={photoSlug === "back" ? 
        `${`https://res.cloudinary.com/abante-clothing/image/upload/abante-tshirts/abante-t-shirt-${slug}-back-image.png`}` :
        photoSlug === "size-chart" ?
        `${`/images/png/abante-t-shirt-size-chart-image.png`}` :
        `${`https://res.cloudinary.com/abante-clothing/image/upload/v1759378284/abante-tshirts/abante-t-shirt-${slug}.png`}`}
        alt={`${slug}-${photoSlug}`}
        style={{ objectFit: "scale-down"}}
        sizes="auto"
        fill
        priority={true}/>
    </div>
    </>
  );
}
