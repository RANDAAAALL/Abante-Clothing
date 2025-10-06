import { ProductsURL } from "@/lib/config";
import TshirtsImageDescContent from "./t-shirts-image-desc-content";

export default async function WeekendOffers(){
  const res = await fetch(`${ProductsURL}`, { cache: "no-store"});
  const data = await res.json();
  console.log("ProductsURL:", ProductsURL);
  console.log("Its Data: ", data);

    return (
        // {/* t-shirts image and description */} 
    <> <TshirtsImageDescContent props={data?.tShirtsPropsData} flag={false}/> </>
  );
}