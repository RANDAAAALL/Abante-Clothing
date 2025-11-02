// src/app/products/[slug]/page.tsx
// import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
// import NavbarContent from "@/components/ui/navbar-section/navbar-client";
import CustomerProductPreview from "@/components/ui/specific-product/customer-product-preview";
import HeroContents from "@/components/ui/specific-product/hero-contents";
import ProductPathTitle from "@/components/ui/specific-product/product-path-title";
import ProductSpecifications from "@/components/ui/specific-product/product-specifications-content";
import { getAllRelatedProducts } from "@/dal/get-all-related-products";
import { getSingleProduct } from "@/dal/get-single-product";
import { getAllProductsName } from "@/dal/get-all-products-name";
import { ParamsProps } from "@/lib/types/params-types";
import { getAllRelatedCustomerProductReview } from "@/dal/get-all-related-customer-product-review";
import { Suspense } from "react";

// export const revalidate = 60;

export default async function Page({ params }: ParamsProps ) {
  const { slug } = await params;
  const [ ProductVariants, AllRelatedProducts, AllRelatedCustomerFeedbacks ] = await Promise.all([
    getSingleProduct({slug}),
    getAllRelatedProducts(),
    getAllRelatedCustomerProductReview()
  ]);

  if(!ProductVariants || !AllRelatedProducts || !AllRelatedCustomerFeedbacks ) return <div className="flex items-center justify-center h-screen"><h1>Error! something wrong on fetching on db</h1></div>

  // console.log("Single Product: ", ProductVariants);
  // console.log("All Products: ",AllProducts);
  // console.log("All Products: ",AllRelatedProducts);
  // console.log("RelatedCustomerProductReview: ", RelatedCustomerFeedbacks);

  return (
    <>
    <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
      <main className="mt-10 flex flex-col sm:items-start min-h-screen sm:max-w-4xl w-full mx-auto p-4">
     
      {/* product path title */}
      <section className="mx-auto md:mx-0"><ProductPathTitle productPathTitle={ProductVariants[0]?.product_item_name as string} /></section>

      {/* hero contents */}
      <section className="mt-9 sm:w-full">
          <Suspense fallback={<div>Loading product...</div>}>
            <HeroContents slug={slug!} props={ProductVariants} />
          </Suspense>
      </section>

      {/* product specifications */}
      <section className="mt-9"><ProductSpecifications props={ProductVariants[0]} /></section>

      {/* related products */}
      <span className="mt-9 font-bold text-lg">Related Products</span>
      <section className="sm:mx-auto"><TshirtsImageDescContent flag={true} props={AllRelatedProducts}/></section>

      {/* customer product preview */}
      <section className="mt-9 w-full"><CustomerProductPreview props={AllRelatedCustomerFeedbacks}/></section>
      </main>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const ProductsName = await getAllProductsName();
  // console.log("All Products Name:", ProductsName);

  return ProductsName?.map((p) => ({
    slug: p.product_item_name,
  }));
}
