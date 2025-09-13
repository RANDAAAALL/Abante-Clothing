import { AllProductsContentProps } from "@/lib/types/view-all-products-types";
import FooterSectionContent from "../footer-section/footer-content";
import NavbarContent from "../nav-bar-section/nav-bar-content";
import ViewAllProductsPathTitle from "./all-products-path-title";
import ViewAllProductsSearchbar from "./all-products-searchbar";
import ViewAllProductsTitle from "./all-products-title";
import { Suspense } from "react";
import TshirtProductsSkeletonCard from "../skeletons/t-shirt-products-card";
import AllFilteredProducts from "./filtered-products";

export default async function ViewAllProductsContent({ searchParams }: AllProductsContentProps){
    const query = (await searchParams).q as string ;
    return (
     <div className="transition duration-500 ease-in-out bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto"> 

        {/* nav-bar section */}
        <section className="z-50 sticky top-0"><NavbarContent /></section>

        {/* main section */}
        <main className="mt-10 w-full md:max-w-3xl mx-auto min-h-screen p-4 md:p-0">

            {/* path title  */}
            <section><ViewAllProductsPathTitle /></section>
            
            {/* searchbar */}
            <section className="w-full mt-2"><ViewAllProductsSearchbar /></section>

            {/* content title */}
            <section className="mt-10 text-center mb-5"><ViewAllProductsTitle /></section>

            {/* product items */}
            <Suspense fallback={<TshirtProductsSkeletonCard/>}>
            <section className="font-bold grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"><AllFilteredProducts query={query}/></section>
            </Suspense>

        </main>

        {/* footer section */}
        <footer className="text-sm w-full p-4"><FooterSectionContent className="mt-25" styleName="md:pt-6" /></footer>

     </div>
    );
}