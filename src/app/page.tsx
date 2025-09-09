import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import CustomerFeedbacks from "@/components/ui/main-section/customer-feedback-content/customer-feedbacks";
import HeroBanner from "@/components/ui/main-section/hero-banner-content/hero-banner";
import ViewAllProducts from "@/components/ui/main-section/weekend-offers-content/view-all-products-";
import WeekendOffers from "@/components/ui/main-section/weekend-offers-content/weekend-offers";
import WeekedOffersTitle from "@/components/ui/main-section/weekend-offers-content/weekend-offers-title";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";
import CustomerFeedbackCarouselSkeleton from "@/components/ui/skeletons/customer-feedback-carousel-card";
import TshirtCarouselSkeletonCard from "@/components/ui/skeletons/t-shirt-carousel-card";
import { Suspense } from "react";

export const experimental_ppr = true;

export default function Home() {
  return (
    <div className="transition duration-500 ease-in-out bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">

    {/* nav-bar section */}
    <section className="z-50 sticky top-0"><NavbarContent /></section>
  
    {/* hero banner */}
    <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[90vh]"><HeroBanner /></section>

    {/* main-section */}
    <main className="flex flex-col justify-center items-center p-4 md:p-6">

    {/* weekend offers content */}
    <section className="flex flex-col justify-center items-center">
    {/* title  */}
    <WeekedOffersTitle/>

    <Suspense fallback={<TshirtCarouselSkeletonCard />}><WeekendOffers/></Suspense>

    {/* navigate to products page */}
    <ViewAllProducts/>
    </section>
    
    {/* customers feedback content */}
    <section className="flex flex-col items-center prose text-justify hyphens-auto md:text-none">
      
    {/* title */}
    <p className="font-black text-4xl text-center sm:text-5xl py-10 mt-10">What Our Customers <br className="md:hidden"/> Are Saying</p>
    
    <Suspense fallback={<CustomerFeedbackCarouselSkeleton/>}><CustomerFeedbacks /></Suspense>
    </section>

    {/* footer section */}
    <footer className="text-sm w-full"><FooterSectionContent className="mt-55" styleName="md:pt-6" /></footer>

    </main>

    </div>
  );
}
 