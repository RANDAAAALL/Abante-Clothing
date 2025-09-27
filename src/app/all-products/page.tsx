import ViewAllProductsPathTitle from "@/components/ui/all-products/all-products-path-title";
import ViewAllProductsSearchbar from "@/components/ui/all-products/all-products-searchbar";
import ViewAllProductsTitle from "@/components/ui/all-products/all-products-title";
import AllProductsWithPaginationContent from "@/components/ui/all-products/all-products-with-pagination-content";
import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import NavbarContent from "@/components/ui/navbar-section/navbar-client";
import TshirtProductsSkeletonCard from "@/components/ui/skeletons/t-shirt-products-card";
import { AllProductsContentProps } from "@/lib/types/view-all-products-types";
import { Suspense } from "react";

export default async function ViewAllProducts({searchParams}: AllProductsContentProps){
    const query = (await searchParams).q as string ;

    return (
     <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto"> 

        {/* main section */}
        <main className="mt-10 w-full md:max-w-3xl mx-auto min-h-screen p-4 md:p-0">

            {/* path title  */}
            <section><ViewAllProductsPathTitle /></section>
            
            {/* searchbar */}
            <section className="w-full mt-2"><ViewAllProductsSearchbar /></section>

            {/* content title */}
            <section className="mt-10 text-center mb-5"><ViewAllProductsTitle /></section>

            {/* product items */}
            <Suspense fallback={<TshirtProductsSkeletonCard />}>
                <section>
                    <AllProductsWithPaginationContent query={query}/>
                </section>
            </Suspense>

        </main>
     </div>
    );
}