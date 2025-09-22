

import Image from "next/image";
import { use } from "react"; 

export default function PhotoPage({
  params,
}: {
  params: Promise<{ slug: string; photoSlug: string }>;
}) {
  const { slug, photoSlug } = use(params);

  return (
    <div className="relative h-screen bg-black">
      <Image
        src={photoSlug === "back" ? 
        `${`/images/png/abante-t-shirt-${slug}-back-image.png`}` :
        photoSlug === "size-chart" ?
        `${`/images/png/abante-t-shirt-size-chart-image.png`}` :
        `${`/images/png/abante-t-shirt-${slug}.png`}`}
        alt={`${slug}-${photoSlug}`}
        style={{ objectFit: 'contain', padding: '50px'}}
        sizes="auto"
        fill
        priority={true}/>
    </div>
  );
}
