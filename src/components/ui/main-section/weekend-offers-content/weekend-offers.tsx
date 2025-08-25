import Link from "next/link";
import TshirtsImageDescContent from "./t-shirts-image-desc";

export default function WeekendOffers(){
    return (
    <>
    {/* title  */}
    <p className="font-black text-4xl sm:text-5xl py-15">Weekend Offers</p>
    
    {/* t-shirts image and description */}
     <TshirtsImageDescContent />

    {/* navigate to products page */}
    <Link href="/products" className="font-medium mt-15 text-md">View All Products</Link>
    </>
    );
}