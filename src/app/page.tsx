import CustomerFeedbackTitle from "@/components/ui/main-section/customer-feedback-content/customer-feedback-title";
import HeroBanner from "@/components/ui/main-section/hero-banner-content/hero-banner";
import ViewAllProductsLink from "@/components/ui/main-section/weekend-offers-content/view-all-products-link";
import WeekedOffersTitle from "@/components/ui/main-section/weekend-offers-content/weekend-offers-title";
import WeekendOffersServerData from "@/components/ui/main-section/weekend-offers-content/weekend-offers-server-data";
import CustomerFeedbackServerData from "@/components/ui/main-section/customer-feedback-content/customer-feedback-server-data";
import CustomerFeedbackCarouselSkeleton from "@/components/ui/skeletons/customer-feedback-carousel-card";
import TshirtCarouselSkeletonCard from "@/components/ui/skeletons/t-shirt-carousel-card";
import { Suspense } from "react";

// export const experimental_ppr = true;

export default function Home() {
  
  return (
    <div className="relative bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
  
    {/* hero banner */}
    <section className="mx-auto"><HeroBanner /></section>

    {/* main-section */}
    <main className="flex flex-col justify-center items-center mx-auto p-4 sm:p-10">

    {/* weekend offers sub container */}
    <section className="flex flex-col justify-center items-center py-10">

    {/* title  */}
    <WeekedOffersTitle/>
    
    {/* weekend offers content */}
    <Suspense fallback={<TshirtCarouselSkeletonCard/>}><WeekendOffersServerData /></Suspense>
        
    {/* navigate to products page */}
    </section>
    <ViewAllProductsLink/>
    
    {/* customer feedback sub container */}
    <section className="flex flex-col items-center prose text-justify hyphens-auto md:text-none py-10">
      
    {/* title */}
    <CustomerFeedbackTitle />
    
    {/* customers feedback content */}
    <Suspense fallback={<CustomerFeedbackCarouselSkeleton/>}><CustomerFeedbackServerData /></Suspense>
    </section>
    </main>
    
    </div>
  );
}
 