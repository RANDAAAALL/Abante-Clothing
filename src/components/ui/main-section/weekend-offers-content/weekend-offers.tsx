import { ProductsURL } from "@/lib/config";
import TshirtsImageDescContent from "./t-shirts-image-desc-content";
import ViewAllProducts from "./view-all-products-";

export default async function WeekendOffers(){
  const res = await fetch(`${ProductsURL}`, { cache: "no-store"});
  const data = await res.json();
    return (
    <>
    {/* title  */}
    <p className="font-black text-4xl sm:text-5xl py-10">Weekend Offers</p>
    
    {/* t-shirts image and description */}
    <TshirtsImageDescContent tshirt={data?.tShirtsPropsData}/>

    {/* navigate to products page */}
    <ViewAllProducts/>
    </>
    );
}