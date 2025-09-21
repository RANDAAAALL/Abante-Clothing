"use client";

import Image from "next/image";
import { use } from "react"; 

export default function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string; photoSlug: string }>;
}) {
  const { slug, photoSlug } = use(params);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <Image
        src={photoSlug === "back" ? 
        `${`/images/png/abante-t-shirt-${slug}-back-image.png`}` :
        `${`/images/png/abante-t-shirt-${slug}.png`}`}
        alt={`${slug}-${photoSlug}`}
        width={500}
        height={500}/>
    </div>
  );
}
