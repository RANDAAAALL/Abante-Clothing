"use client"

import { ProductsURL } from "@/lib/config";
import TshirtsImageDescContent from "./t-shirts-image-desc-content";
import ViewAllProducts from "./view-all-products-";
import { useQuery } from "@tanstack/react-query";

export default function WeekendOffers(){
      const { data } = useQuery({
      queryKey: ['products'],
      queryFn: async () => {
        // console.log("-------FETCHING PRODUCTS-----!")
        const res = await fetch(`${ProductsURL}`);
        return await res.json();
      },
      networkMode: 'online',
      refetchOnMount: false,
      refetchOnWindowFocus: false, 
    }
  )
    

    return (
    <>
    {/* title  */}
    <p className="font-black text-4xl sm:text-5xl py-10">Weekend Offers</p>
    
    {/* t-shirts image and description */}
    <TshirtsImageDescContent tshirt={data?.products}/>

    {/* navigate to products page */}
    <ViewAllProducts/>
    </>
    );
}