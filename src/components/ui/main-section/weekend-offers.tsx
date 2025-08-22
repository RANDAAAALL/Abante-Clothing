import Link from "next/link";
import TshirtsImageDescContent from "./t-shirts-image-desc";

export default function WeekendOffers(){
    return (
    <>
    {/* title  */}
    <p className="font-black text-5xl py-20">Weekend Offers</p>
    
    {/* t-shirts image and description */}
    <div className="flex gap-30"><TshirtsImageDescContent /></div>

    {/* navigate to products page */}
    <Link href="/products" className="font-medium mt-20">View All Products</Link>
    </>
    );
}