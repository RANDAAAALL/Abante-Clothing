import ViewAllProductsPathTitle from "@/components/ui/all-products/all-products-path-title";
import ViewAllProductsSearchbar from "@/components/ui/all-products/all-products-searchbar";
import ViewAllProductsTitle from "@/components/ui/all-products/all-products-title";
import AllProductsSortingDropdown from "@/components/ui/all-products/all-products-sorting-dropdown";
import TshirtProductsSkeletonCard from "@/components/ui/skeletons/t-shirt-products-card";
import { Suspense } from "react";
import { getAllProductsCached } from "@/lib/cache/get-all-products";
import { AllProductsContentProps } from "@/lib/types/view-all-products-types";
import AllProductsClientContent from "@/components/ui/all-products/all-products-with-pagination-content";

export default async function ViewAllProducts({
  searchParams,
}: AllProductsContentProps) {
  const params = await searchParams;
  const query = params.q as string;
  const sort = params.sort as string;
  const allProducts = await getAllProductsCached();

  return (
    <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
      <main className="mt-10 w-full md:max-w-3xl mx-auto min-h-screen p-4 md:p-0">
        <section>
          <ViewAllProductsPathTitle />
        </section>

        <section className="w-full mt-2">
          <ViewAllProductsSearchbar />
        </section>

        <section className="mt-7 mb-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex-1 text-center sm:text-left">
              <ViewAllProductsTitle />
            </div>
            <div className="flex-shrink-0">
              <AllProductsSortingDropdown />
            </div>
          </div>
        </section>

        <Suspense fallback={<TshirtProductsSkeletonCard />}>
          <section>
            <AllProductsClientContent
              initialProducts={allProducts}
              query={query}
              sort={sort}
            />
          </section>
        </Suspense>
      </main>
    </div>
  );
}
