import Image from "next/image";
import Link from "next/link";


export default function HeroBanner(){
    return ( 
    <div className="relative">
        <Image
        src="/images/png/abante-clothing-hero-image.gif"
        width={1540}
        height={843}
        priority
        alt="abante-clothing-hero-image"
        />
        <p className="font-black text-white text-5xl md:text-7xl leading-tight max-w-xl absolute top-20 px-8 md:px-16 lg:px-24">Build to <br/> Hustle.</p>
        <Link href="/products" title="Shop Now"
         className="font-bold mt-6 absolute bottom-10 right-10 px-10 py-3 border border-white text-white rounded-xl text-sm hover:bg-white hover:text-black transition-all border-4">Show Now</Link>
    </div>
    );
}