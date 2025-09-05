import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import CustomerFeedbacks from "@/components/ui/main-section/customer-feedback-content/customer-feedbacks";
import HeroBanner from "@/components/ui/main-section/hero-banner-content/hero-banner";
import ViewAllProducts from "@/components/ui/main-section/weekend-offers-content/view-all-products-";
import WeekendOffers from "@/components/ui/main-section/weekend-offers-content/weekend-offers";
import WeekedOffersTitle from "@/components/ui/main-section/weekend-offers-content/weekend-offers-title";
// import WeekendOffers from "@/components/ui/main-section/weekend-offers-content/weekend-offers";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";
import SkeletonCard from "@/components/ui/skeletons/skeleton-card";
import { Suspense } from "react";

export const experimental_ppr = true;

export default function Home() {
  return (
    <div className="transition duration-500 ease-in-out bg-card-white-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">

    {/* nav-bar section */}
    <header className="shadow-md rounded-b-xl z-100000 dark:bg-black-background sticky top-0 w-full font-medium gap-10 flex p-4 max-w-screen-xl md:justify-evenly md:items-center md:mx-auto"><NavbarContent /></header>
  
    {/* hero banner */}
    <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[90vh]"><HeroBanner /></section>

    {/* main-section */}
    <main className="flex flex-col justify-center items-center p-4 md:p-6">

    {/* weekend offers content */}
    <section className="flex flex-col justify-center items-center">
    {/* title  */}
    <WeekedOffersTitle/>

    <Suspense fallback={<SkeletonCard />}><WeekendOffers/></Suspense>

    {/* navigate to products page */}
    <ViewAllProducts/>
    </section>
    
    {/* customers feedback content */}
    <section className="flex flex-col items-center prose text-justify hyphens-auto md:text-none"><CustomerFeedbacks /></section>

    {/* footer section */}
    <footer className="text-sm w-full"><FooterSectionContent className="mt-55" styleName="md:pt-6" /></footer>

    </main>

    </div>
  );
}
 