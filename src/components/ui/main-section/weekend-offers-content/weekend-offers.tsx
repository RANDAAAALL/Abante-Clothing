import { ProductsURL } from "@/lib/config";
import TshirtsImageDescContent from "./t-shirts-image-desc-content";

export default async function WeekendOffers(){
  await new Promise(res => setTimeout(res,1000));
  const res = await fetch(`${ProductsURL}`, { cache: "no-store"});
  const data = await res.json();
    return (
    <>
    {/* t-shirts image and description */}
    <TshirtsImageDescContent props={data?.tShirtsPropsData} flag={false}/>
    </>
    );
}