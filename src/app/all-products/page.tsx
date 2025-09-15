import ViewAllProductsPathTitle from "@/components/ui/all-products/all-products-path-title";
import ViewAllProductsSearchbar from "@/components/ui/all-products/all-products-searchbar";
import ViewAllProductsTitle from "@/components/ui/all-products/all-products-title";
import AllProductsWithPagination from "@/components/ui/all-products/all-products-with-pagination";
import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import NavbarContent from "@/components/ui/navbar-section/navbar-content";
import TshirtProductsSkeletonCard from "@/components/ui/skeletons/t-shirt-products-card";
import { filteredProductItems } from "@/lib/filtered-product-items";
import { AllProductsContentProps } from "@/lib/types/view-all-products-types";
import { Suspense } from "react";

export default async function ViewAllProducts({searchParams}: AllProductsContentProps){
    const query = (await searchParams).q as string ;
    const data = await filteredProductItems({query});

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
                <section>
                    <AllProductsWithPagination props={data}/>
                </section>
            </Suspense>

        </main>

        {/* footer section */}
        <footer className="text-sm w-full p-4"><FooterSectionContent className="mt-25" styleName="md:pt-6" /></footer>

     </div>
    );
}