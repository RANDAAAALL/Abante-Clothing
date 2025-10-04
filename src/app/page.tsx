import CustomerFeedbackTitle from "@/components/ui/main-section/customer-feedback-content/customer-feedback-title";
import CustomerFeedbacks from "@/components/ui/main-section/customer-feedback-content/customer-feedbacks";
import HeroBanner from "@/components/ui/main-section/hero-banner-content/hero-banner";
import ViewAllProductsLink from "@/components/ui/main-section/weekend-offers-content/view-all-products-link";
import WeekendOffers from "@/components/ui/main-section/weekend-offers-content/weekend-offers";
import WeekedOffersTitle from "@/components/ui/main-section/weekend-offers-content/weekend-offers-title";
import CustomerFeedbackCarouselSkeleton from "@/components/ui/skeletons/customer-feedback-carousel-card";
import TshirtCarouselSkeletonCard from "@/components/ui/skeletons/t-shirt-carousel-card";
import { Suspense } from "react";

export const experimental_ppr = true;

export default function Home() {
  
  return (
    <div className="relative bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
  
    {/* hero banner */}
    <section className="mx-auto"><HeroBanner /></section>

    {/* main-section */}
    <main className="flex flex-col justify-center items-center mx-auto p-4 sm:p-10">

    {/* weekend offers content */}
    <section className="flex flex-col justify-center items-center py-10">
    {/* title  */}
    <WeekedOffersTitle/>

    <Suspense fallback={<TshirtCarouselSkeletonCard/>}><WeekendOffers/></Suspense>
        
    {/* navigate to products page */}
    </section>
    <ViewAllProductsLink/>
    
    {/* customers feedback content */}
    <section className="flex flex-col items-center prose text-justify hyphens-auto md:text-none py-10">
      
    {/* title */}
    <CustomerFeedbackTitle />
    
    <Suspense fallback={<CustomerFeedbackCarouselSkeleton/>}><CustomerFeedbacks /></Suspense>
    </section>
    </main>
    
    </div>
  );
}
 