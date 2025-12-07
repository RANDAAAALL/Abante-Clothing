import ViewAllProductsPathTitle from "@/components/ui/all-products/all-products-path-title";
import ViewAllProductsSearchbar from "@/components/ui/all-products/all-products-searchbar";
import ViewAllProductsTitle from "@/components/ui/all-products/all-products-title";
import AllProductsSortingDropdown from "@/components/ui/all-products/all-products-sorting-dropdown";
import TshirtProductsSkeletonCard from "@/components/ui/skeletons/t-shirt-products-card";
import { Suspense } from "react";
import { AllProductsContentProps } from "@/lib/types/view-all-products-types";
import AllProductsServerData from "@/components/ui/all-products/all-products-server-data";

export default async function ViewAllProducts({
  searchParams,
}: AllProductsContentProps) {
  const params = await searchParams;
  const query = params.q as string;
  const sort = params.sort as string;

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
            <AllProductsServerData query={query} sort={sort} />
          </section>
        </Suspense>
      </main>
    </div>
  );
}

// import ViewAllProductsPathTitle from "@/components/ui/all-products/all-products-path-title";
// import ViewAllProductsSearchbar from "@/components/ui/all-products/all-products-searchbar";
// import ViewAllProductsTitle from "@/components/ui/all-products/all-products-title";
// import AllProductsSortingDropdown from "@/components/ui/all-products/all-products-sorting-dropdown";
// import TshirtProductsSkeletonCard from "@/components/ui/skeletons/t-shirt-products-card";
// import { Suspense, use } from "react";
// import { AllProductsContentProps } from "@/lib/types/view-all-products-types";
// import AllProductsServerData from "@/components/ui/all-products/all-products-server-data";

// // Wrap the searchParams usage in a separate component
// function ViewAllProductsContent({ searchParams }: AllProductsContentProps) {
//   const params = use(searchParams); // Use 'use' instead of 'await'
//   const query = params.q as string;
//   const sort = params.sort as string;

//   return (
//     <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
//       <main className="mt-10 w-full md:max-w-3xl mx-auto min-h-screen p-4 md:p-0">
//         <section>
//           <ViewAllProductsPathTitle />
//         </section>

//         <section className="w-full mt-2">
//           <ViewAllProductsSearchbar />
//         </section>

//         <section className="mt-7 mb-5">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
//             <div className="flex-1 text-center sm:text-left">
//               <ViewAllProductsTitle />
//             </div>
//             <div className="flex-shrink-0">
//               <AllProductsSortingDropdown />
//             </div>
//           </div>
//         </section>

//         <Suspense fallback={<TshirtProductsSkeletonCard />}>
//           <section>
//             <AllProductsServerData query={query} sort={sort} />
//           </section>
//         </Suspense>
//       </main>
//     </div>
//   );
// }

// export default function ViewAllProducts({ searchParams }: AllProductsContentProps) {
//   return (
//     <Suspense fallback={
//       <div className="flex items-center justify-center h-screen">
//         <div>Loading products page...</div>
//       </div>
//     }>
//       <ViewAllProductsContent searchParams={searchParams} />
//     </Suspense>
//   );
// }