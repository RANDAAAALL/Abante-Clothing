import HeroBanner from "@/components/ui/main-section/hero-banner";
import NavbarContent from "@/components/ui/nav-bar/nav-bar-content";

export default function Home() {
  return (
    <div className="text-black min-h-screen ">

    {/* nav-bar section */}
    <header className="font-metrapolis font-medium text-md flex justify-evenly p-4 space-x-10 items-center"><NavbarContent /></header>
   
    {/* main-section */}

    {/* hero banner */}
    <main className="flex flex-col justify-center items-center">

    <section><HeroBanner /></section>

    {/* weekend offers content */}
    <section></section>
    
    {/* customers feedback content */}
    <section></section>

    {/* footer section */}
    <section></section>

    </main>

    </div>
  );
}
 