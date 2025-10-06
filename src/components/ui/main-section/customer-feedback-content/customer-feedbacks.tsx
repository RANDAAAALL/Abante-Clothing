import { CustomerFeedbackURL } from "@/lib/config";
import CustomerImageDescContent from "./customer-image-desc";

export default async function CustomerFeedbacks(){
    await new Promise(res => setTimeout(res,1000));
    const res = await fetch(`${CustomerFeedbackURL}`, { cache: "no-store"});
    const data = await res.json();
    console.log("CustomerFeedbackURL:", CustomerFeedbackURL);
    console.log("Its Data: ", data);

    return (
        <>
        {/* customers feedback image, description and rating */}
        <CustomerImageDescContent customerFeedback={data?.customerFeedbacks}/>
        </>
    );
}