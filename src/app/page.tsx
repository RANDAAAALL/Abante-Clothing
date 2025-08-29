import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import CustomerFeedbacks from "@/components/ui/main-section/customer-feedback-content/customer-feedbacks";
import HeroBanner from "@/components/ui/main-section/hero-banner-content/hero-banner";
import WeekendOffers from "@/components/ui/main-section/weekend-offers-content/weekend-offers";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";

export default function Home() {
  return (
    <div className="transition duration-500 ease-in-out bg-white dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">

    {/* nav-bar section */}
    <header className="w-full font-medium gap-10 flex p-4 max-w-screen-xl md:justify-evenly md:items-center md:mx-auto"><NavbarContent /></header>
   
    {/* hero banner */}
    <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[90vh]"><HeroBanner /></section>

    {/* main-section */}
    <main className="flex flex-col justify-center items-center p-4 md:p-6">

    {/* weekend offers content */}
    <section className="flex flex-col justify-center items-center"><WeekendOffers /></section>
    
    {/* customers feedback content */}
    <section className="flex flex-col items-center prose text-justify hyphens-auto md:text-none"><CustomerFeedbacks /></section>

    {/* footer section */}
    <section className="font-medium text-sm w-full"><FooterSectionContent /></section>

    </main>

    </div>
  );
}
 