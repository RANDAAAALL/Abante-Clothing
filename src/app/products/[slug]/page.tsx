// main
import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
import HeroContents from "@/components/ui/specific-product/hero-contents";
import ProductPathTitle from "@/components/ui/specific-product/product-path-title";
import ProductSpecifications from "@/components/ui/specific-product/product-specifications-content";
import { getAllRelatedProducts } from "@/dal/get-all-related-products";
import { cachedGetSingleProduct } from "@/dal/get-single-product";
import { getAllProductsName } from "@/dal/get-all-products-name";
import { getAllRelatedCustomerProductReview } from "@/dal/get-all-related-customer-product-review";
import { Suspense } from "react";
import type { Metadata } from "next";
import CustomerReviewContent from "@/components/ui/specific-product/customer-product-preview-content";

export const revalidate = 30; // 30seconds stale time

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const ProductVariants = await cachedGetSingleProduct(slug);
  const product = ProductVariants?.[0];
  
  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable.",
    };
  }

  const productName = product.product_item_name || "Product";
  const capitalizedTitle = productName.charAt(0).toUpperCase() + productName.slice(1);
  const description = product.product_item_design_features 
    ? `${product.product_item_design_features.substring(0, 150)}`
    : `Buy ${productName} from Abante Clothing`;

  return {
    title: `${capitalizedTitle} | Abante Clothing`,
    description,
    openGraph: {
      title: capitalizedTitle,
      description,
      url: `https://abante-clothing.vercel.app/products/${slug}`,
      images: [{
        url: product.product_item_image || '/tshirt_placeholder.png',
        width: 1200,
        height: 630,
        alt: productName,
      }],
      type: "website",
      siteName: "Abante Clothing",
    },
    twitter: {
      card: "summary_large_image",
      title: capitalizedTitle,
      description,
      images: [product.product_item_image || ''],
    },
  };
}

export default async function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  // parallel data fetching
  const [ProductVariants, AllRelatedProducts] = await Promise.all([
    cachedGetSingleProduct(slug),
    getAllRelatedProducts(),
  ]);

  if (!ProductVariants || ProductVariants.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-red-500">Product not found</h1>
      </div>
    );
  }

  const reviewPromise = ProductVariants[0]?.product_item_name 
    ? getAllRelatedCustomerProductReview(ProductVariants[0].product_item_name)
    : Promise.resolve([]);

  return (
    <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen">
      <main className="mt-10 max-w-4xl mx-auto p-4">
        {/* Product path */}
        <ProductPathTitle 
          productPathTitle={ProductVariants[0].product_item_name as string} 
        />

        {/* Hero section */}
        <section className="mt-9">
          <Suspense fallback={<div>Loading....</div>}>
            <HeroContents slug={slug} props={ProductVariants} />
          </Suspense>
        </section>

        {/* Product specifications */}
        <section className="mt-9">
          <ProductSpecifications props={ProductVariants[0]} />
        </section>

        {/* Related products */}
        <h2 className="mt-9 font-bold text-lg">Related Products</h2>
        <section className="mt-4">
          <TshirtsImageDescContent flag={true} props={AllRelatedProducts!} />
        </section>

        {/* Customer reviews */}
        <section className="mt-9">
          <Suspense fallback={<div className="h-40 animate-pulse bg-gray-200 rounded" />}>
            <CustomerReviewContent reviewPromise={reviewPromise} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const ProductsName = await getAllProductsName();
  
  if (!ProductsName) return [];
  
  return ProductsName.map((p) => ({
    slug: p.product_item_name,
  }));
};

// test part
// import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
// import CustomerProductPreview from "@/components/ui/specific-product/customer-product-preview";
// import HeroContents from "@/components/ui/specific-product/hero-contents";
// import ProductPathTitle from "@/components/ui/specific-product/product-path-title";
// import ProductSpecifications from "@/components/ui/specific-product/product-specifications-content";
// import { getAllRelatedProducts } from "@/dal/get-all-related-products";
// import { cachedGetSingleProduct } from "@/dal/get-single-product";
// import { getAllProductsName } from "@/dal/get-all-products-name";
// import { ParamsProps } from "@/lib/types/params-types";
// import { getAllRelatedCustomerProductReview } from "@/dal/get-all-related-customer-product-review";
// import { Suspense } from "react";
// import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
// import type { Metadata } from "next";
// import { buildProductMetadata } from "@/lib/helper/metatdata";

// export const revalidate = 30;

// export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
//   const { slug } = await params;
//   const ProductVariants = await cachedGetSingleProduct( slug );
//   return buildProductMetadata(ProductVariants![0], slug);
// }

// export default async function Page({ params }: ParamsProps ) {
//   const { slug } = await params;
  
//    const [ ProductVariants, AllRelatedProducts ] = await Promise.all([
//     cachedGetSingleProduct( slug as string ),
//     getAllRelatedProducts(),
//   ]);

//   if(!ProductVariants || !AllRelatedProducts) return <div className="flex items-center justify-center h-screen"><h1>Error! something wrong on fetching on db</h1></div>

//   let CurrentProductFeedbacks: CustomerFeedbackProps[] = [];
//   if (ProductVariants[0]?.product_item_ID != null) {
//     CurrentProductFeedbacks = await getAllRelatedCustomerProductReview(
//       ProductVariants[0].product_item_name as string
//     );
//   }

//   // console.log("Single Product: ", ProductVariants);
//   // console.log("All Products: ",AllProducts);
//   // console.log("All Products: ",AllRelatedProducts);
//   // console.log("RelatedCustomerProductReview: ", RelatedCustomerFeedbacks);

//   return (
//     <>
//     <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">
//       <main className="mt-10 flex flex-col sm:items-start min-h-screen sm:max-w-4xl w-full mx-auto p-4">
     
//       {/* product path title */}
//       <section className="mx-auto md:mx-0"><ProductPathTitle productPathTitle={ProductVariants[0]?.product_item_name as string} /></section>

//       {/* hero contents */}
//       <section className="mt-9 sm:w-full">
//           <Suspense fallback={<div>Loading product...</div>}>
//             <HeroContents slug={slug!} props={ProductVariants} />
//           </Suspense>
//       </section>

//       {/* product specifications */}
//       <section className="mt-9"><ProductSpecifications props={ProductVariants[0]} /></section>

//       {/* related products */}
//       <span className="mt-9 font-bold text-lg">Related Products</span>
//       <section className="sm:mx-auto"><TshirtsImageDescContent flag={true} props={AllRelatedProducts}/></section>

//       {/* customer product preview */}
//       <section className="mt-9 w-full"><CustomerProductPreview props={CurrentProductFeedbacks}/></section>
//       </main>
//       </div>
//     </>
//   );
// }

// export async function generateStaticParams() {
//   const ProductsName = await getAllProductsName();
//   // console.log("All Products Name:", ProductsName);

//   return ProductsName?.map((p) => ({
//     slug: p.product_item_name,
//   }));
// }