import CustomerImageDescContent from "./customer-image-desc";
import { getCustomerFeedbacksCached } from "@/lib/cache/get-customer-feedbacks-cached";

export default async function CustomerFeedbackServerData(){
    const customerFeedbacks = await getCustomerFeedbacksCached();

    {/* customers feedback image, description and rating */}
    return <CustomerImageDescContent customerFeedback={customerFeedbacks}/>
}