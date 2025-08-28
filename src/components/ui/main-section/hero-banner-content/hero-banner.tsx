import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <>
      <Image
        src="/images/png/abante-clothing-hero-image.gif"
        alt="abante-clothing-hero-image"
        fill
        priority
        unoptimized={true}
        className="object-cover"
      />
      <p className="font-black text-white text-6xl md:text-9xl absolute top-6 md:top-20 px-8 md:px-16 lg:px-24">
        Build to <br /> Hustle.
      </p>
      <Link
        href="/products"
        title="Shop Now"
        className="font-bold absolute bottom-7 right-5 px-15 md:bottom-20 md:right-20 py-3 border border-white text-white rounded-xl text-md hover:bg-white hover:text-black transition-all border-4"
      >
        Shop Now
      </Link>
    </>
  );
}
