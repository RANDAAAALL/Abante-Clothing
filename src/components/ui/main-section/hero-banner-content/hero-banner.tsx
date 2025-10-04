import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="relative w-full  h-[450px] sm:h-[550px] md:h-[700px] 2xl:h-[900px] xl:rounded-md overflow-hidden">
    <Image
      src="/images/png/HeroBanner.png"
      fill
      className="object-cover object-top"
      priority
      sizes="100vw"
      unoptimized={true}
      alt="hero-banner"/>
    <p className="rounded-full font-black text-white text-6xl md:text-9xl absolute top-6 md:top-20 px-8 md:px-16 lg:px-24">
      Build to <br /> Hustle.
    </p>
    <Link
      href="/all-products"
      title="Shop Now"
      className="font-bold absolute bottom-7 right-5 px-15 md:bottom-20 md:right-20 py-3 border border-white text-white rounded-xl text-md hover:bg-white hover:text-black transition-all border-4"
    >
      Shop Now
    </Link>
  </div>
  
  );
}
