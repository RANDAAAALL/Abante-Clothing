import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import CustomerProductPreview from "./customer-product-preview";

export default async function CustomerReviewServerData({ 
    reviewPromise 
  }: { 
    reviewPromise: Promise<CustomerFeedbackProps[]> 
  }) {
    const reviews = await reviewPromise;
    return <CustomerProductPreview props={reviews} />;
  }