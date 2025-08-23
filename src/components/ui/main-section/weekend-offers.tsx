import Link from "next/link";
import TshirtsImageDescContent from "./t-shirts-image-desc";

export default function WeekendOffers(){
    return (
    <>
    {/* title  */}
    <p className="font-black text-4xl sm:text-5xl py-20">Weekend Offers</p>
    
    {/* t-shirts image and description */}
    <div className="flex flex-col gap-10 md:flex-row md:gap-10"><TshirtsImageDescContent /></div>

    {/* navigate to products page */}
    <Link href="/products" className="font-medium mt-20 text-lg">View All Products</Link>
    </>
    );
}