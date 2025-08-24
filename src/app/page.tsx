import HeroBanner from "@/components/ui/main-section/hero-banner";
import WeekendOffers from "@/components/ui/main-section/weekend-offers";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";

export default function Home() {
  return (
    <div className="text-black min-h-screen w-full">

    {/* nav-bar section */}
    <header className="font-medium gap-10 flex md:justify-evenly md:items-center p-4"><NavbarContent /></header>
   
    {/* hero banner */}
    <section className="relative w-full h-[50vh] md:h-[70vh] lg:h-[90vh]"><HeroBanner /></section>

    {/* main-section */}
    <main className="flex flex-col justify-center items-center p-4 md:p-6">

    {/* weekend offers content */}
    <section className="flex flex-col justify-center items-center"><WeekendOffers /></section>
    
    {/* customers feedback content */}
    <section></section>

    {/* footer section */}
    <section></section>

    </main>

    </div>
  );
}
 