import TshirtsImageDescContent from "./t-shirts-image-desc-content";
import { getWeekendOffersProductsCached } from "@/lib/cache/get-weekend-offers-products-cached";

export default async function WeekendOffersServerData(){
  const weekendOffersProductsData = await getWeekendOffersProductsCached();
  
  // {/* t-shirts image and description */} 
  return <TshirtsImageDescContent props={weekendOffersProductsData} flag={false}/>
}