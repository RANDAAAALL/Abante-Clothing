// app/products/[slug]/page.tsx
import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
import CustomerProductPreview from "@/components/ui/specific-product/customer-product-preview";
import HeroContents from "@/components/ui/specific-product/hero-contents";
import ProductPathTitle from "@/components/ui/specific-product/product-path-title";
import ProductSpecifications from "@/components/ui/specific-product/product-specifications-content";
import { getAllRelatedProducts } from "@/dal/get-all-related-products";
import { getSingleProduct } from "@/dal/get-single-product";
import { getAllProductsName } from "@/dal/get-all-products-name";
import { getAllRelatedCustomerProductReview } from "@/dal/get-all-related-customer-product-review";
import { Suspense, cache } from "react";
import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import type { Metadata } from "next";
import { buildProductMetadata } from "@/lib/helper/metatdata";

export const revalidate = 30;

const cachedGetSingleProduct = cache(async (slug: string) => {
  return getSingleProduct({ slug });
});

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string | string[] }>;
}): Promise<Metadata> {
  const [slug, resolvedSearch] = await Promise.all([
    params.then(p => p.slug),
    searchParams
  ]);

  const colors = resolvedSearch.color 
    ? (Array.isArray(resolvedSearch.color) ? resolvedSearch.color : [resolvedSearch.color])
    : [];

  const ProductVariants = await cachedGetSingleProduct(slug);
  return buildProductMetadata(ProductVariants, slug, colors);
}

export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string | string[] }>;
}) {
  const [
    slug, 
    resolvedSearch,
    ProductVariants, 
    AllRelatedProducts
  ] = await Promise.all([
    params.then(p => p.slug),
    searchParams,
    cachedGetSingleProduct((await params).slug),
    getAllRelatedProducts()
  ]);

  const colors = resolvedSearch.color 
    ? (Array.isArray(resolvedSearch.color) ? resolvedSearch.color : [resolvedSearch.color])
    : [];

  if (!ProductVariants || !AllRelatedProducts)
    return (
      <div className="flex items-center justify-center h-screen">
        <h1>Error! something wrong on fetching on db</h1>
      </div>
    );

  // fetch reviews after main content loads 
  const reviewPromise = ProductVariants[0]?.product_item_name 
    ? getAllRelatedCustomerProductReview(ProductVariants[0].product_item_name)
    : Promise.resolve([]);

  return (
    <>
      <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
        <main className="mt-10 flex flex-col sm:items-start min-h-screen sm:max-w-4xl w-full mx-auto p-4">
          {/* product path title */}
          <section className="mx-auto md:mx-0">
            <ProductPathTitle
              productPathTitle={ProductVariants[0]?.product_item_name as string}
            />
          </section>

          {/* hero contents */}
          <section className="mt-9 sm:w-full">
            <Suspense fallback={<div>Loading product...</div>}>
              <HeroContents 
                slug={slug} 
                props={ProductVariants} 
                selectedColors={colors}  
              />
            </Suspense>
          </section>

          {/* product specifications */}
          <section className="mt-9">
            <ProductSpecifications props={ProductVariants[0]} />
          </section>

          {/* related products */}
          <span className="mt-9 font-bold text-lg">Related Products</span>
          <section className="sm:mx-auto">
            <TshirtsImageDescContent flag={true} props={AllRelatedProducts} />
          </section>

          {/* customer product preview - load separately */}
          <section className="mt-9 w-full">
            <Suspense fallback={<div>Loading reviews...</div>}>
              <ReviewContent reviewPromise={reviewPromise} />
            </Suspense>
          </section>
        </main>
      </div>
    </>
  );
}

// separate component for reviews
async function ReviewContent({ 
  reviewPromise 
}: { 
  reviewPromise: Promise<CustomerFeedbackProps[]> 
}) {
  const reviews = await reviewPromise;
  return <CustomerProductPreview props={reviews} />;
}

// FIX generateStaticParams - Ensure it builds ALL pages
export async function generateStaticParams() {
  try {
    const ProductsName = await getAllProductsName();
    
    if (!ProductsName || ProductsName.length === 0) {
      console.warn('No products found for static generation');
      return [];
    }
    
    // specific logging
    // console.log(`Generating ${ProductsName.length} static paths`);
    
    return ProductsName.map((p) => ({
      slug: p.product_item_name?.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch (error) {
    // console.error('Error in generateStaticParams:', error);
    return [];
  }
}