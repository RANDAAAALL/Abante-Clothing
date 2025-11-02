import { ProductsURL } from "@/lib/config";
import TshirtsImageDescContent from "./t-shirts-image-desc-content";

export default async function WeekendOffers(){
  const res = await fetch(`${ProductsURL}`);
  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch failed:", text);
    return null;
  }
  const data = await res.json();

    return (
        // {/* t-shirts image and description */} 
    <> <TshirtsImageDescContent props={data?.tShirtsPropsData} flag={false}/> </>
  );
}