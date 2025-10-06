import { CustomerFeedbackURL } from "@/lib/config";
import CustomerImageDescContent from "./customer-image-desc";

export default async function CustomerFeedbacks(){
    await new Promise(res => setTimeout(res,1000));
    const res = await fetch(`${CustomerFeedbackURL}`, { cache: "no-store"});
    if (!res.ok) {
        const text = await res.text();
        console.error("Fetch failed:", text); 
        return null;
      }
    const data = await res.json();

    return (
        <>
        {/* customers feedback image, description and rating */}
        <CustomerImageDescContent customerFeedback={data?.customerFeedbacks}/>
        </>
    );
}