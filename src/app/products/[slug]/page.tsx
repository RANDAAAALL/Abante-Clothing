// main part
import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
import { getAllRelatedProducts } from "@/dal/get-all-related-products";
import { getSingleProduct } from "@/dal/get-single-product";
import { getAllProductsName } from "@/dal/get-all-products-name";
import { getAllRelatedCustomerProductReview } from "@/dal/get-all-related-customer-product-review";
import { Suspense } from "react";
import type { Metadata } from "next";
import HeroContentClientData from "@/components/ui/specific-product/hero-content-client-data";
import ProductSpecificationsContent from "@/components/ui/specific-product/product-specifications-content";
import CustomerReviewServerData from "@/components/ui/specific-product/customer-product-preview-server-data";
import ProductPathTitleContentClientData from "@/components/ui/specific-product/product-path-title-content-client-data";

export const revalidate = 30; // 30seconds stale time
export const dynamicParams = true; // allows new slugs 

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const ProductVariants = await getSingleProduct(slug);
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
    getSingleProduct(slug),
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
        <ProductPathTitleContentClientData 
          productPathTitle={ProductVariants[0].product_item_name as string} 
        />

        {/* Hero section */}
        <section className="mt-9">
          <Suspense fallback={<div>Loading....</div>}>
            <HeroContentClientData slug={slug} props={ProductVariants} />
          </Suspense>
        </section>

        {/* Product specifications */}
        <section className="mt-9">
          <ProductSpecificationsContent props={ProductVariants[0]} />
        </section>

        {/* Related products */}
        <h2 className="mt-9 font-bold text-lg">Related Products</h2>
        <section className="mt-4">
          <TshirtsImageDescContent flag={true} props={AllRelatedProducts!} />
        </section>

        {/* Customer reviews */}
        <section className="mt-9">
          <Suspense fallback={<div className="h-40 animate-pulse bg-gray-200 rounded" />}>
            <CustomerReviewServerData reviewPromise={reviewPromise} />
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
// import { getAllRelatedProducts } from "@/dal/get-all-related-products";
// import { cachedGetSingleProduct } from "@/dal/get-single-product";
// import { getAllProductsName } from "@/dal/get-all-products-name";
// import { Suspense, use } from "react";
// import type { Metadata } from "next";
// import { TshirtType } from "@/lib/types/t-shirt-types";
// import ProductPathTitleServerData from "@/components/ui/specific-product/product-path-title-server-data";
// import HeroContentServerData from "@/components/ui/specific-product/hero-content-server-data";
// import AllRelatedProductsServerData from "@/components/ui/specific-product/all-related-products-server-data";
// import CustomerReviewServerDataContent from "@/components/ui/specific-product/customer-product-preview-server-data-content";

// // 30seconds stale time
// export const dynamicParams = true;

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }): Promise<Metadata> {
//   const { slug } = await params;
//   const ProductVariants = await cachedGetSingleProduct(slug);
//   const product = ProductVariants?.[0];

//   if (!product) {
//     return {
//       title: "Product Not Found",
//       description: "This product is unavailable.",
//     };
//   }

//   const productName = product.product_item_name || "Product";
//   const capitalizedTitle =
//     productName.charAt(0).toUpperCase() + productName.slice(1);
//   const description = product.product_item_design_features
//     ? `${product.product_item_design_features.substring(0, 150)}`
//     : `Buy ${productName} from Abante Clothing`;

//   return {
//     title: `${capitalizedTitle} | Abante Clothing`,
//     description,
//     openGraph: {
//       title: capitalizedTitle,
//       description,
//       url: `https://abante-clothing.vercel.app/products/${slug}`,
//       images: [
//         {
//           url: product.product_item_image || "/tshirt_placeholder.png",
//           width: 1200,
//           height: 630,
//           alt: productName,
//         },
//       ],
//       type: "website",
//       siteName: "Abante Clothing",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: capitalizedTitle,
//       description,
//       images: [product.product_item_image || ""],
//     },
//   };
// }

// function ProductPageContent({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = use(params);

//   // all data fetching in parallel way
//   const productPromise = cachedGetSingleProduct(slug) as Promise<
//     TshirtType[] | undefined
//   >;
//   const relatedProductsPromise = getAllRelatedProducts() as Promise<
//     TshirtType[] | undefined
//   >;

//   return (
//     <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen">
//       <main className="mt-10 max-w-4xl mx-auto p-4">
//         {/* Product path - needs product data */}
//         <Suspense
//           fallback={
//             <div className="h-6 w-49 checkout-form-skeleton rounded"></div>
//           }
//         >
//           <ProductPathTitleServerData productPromise={productPromise} />
//         </Suspense>

//         {/* Hero section */}
//         <section className="mt-9">
//           <Suspense
//             fallback={
//               <div className="h-150 md:h-92 checkout-form-skeleton rounded"></div>
//             }
//           >
//             <HeroContentServerData
//               slug={slug}
//               productPromise={productPromise}
//             />
//           </Suspense>
//         </section>

//         {/* Product specifications */}
//         <section className="mt-9">
//           {/* Title */}
//           <span className="font-bold text-lg">Product Specifications</span>
//           <Suspense
//             fallback={
//               <div className="mt-4 h-48 md:h-58 checkout-form-skeleton rounded"></div>
//             }
//           >
//             <ProductPathTitleServerData productPromise={productPromise} />
//           </Suspense>
//         </section>

//         {/* Related products */}
//         <h2 className="mt-9 font-bold text-lg">Related Products</h2>
//         <section className="mt-3">
//           <Suspense
//             fallback={
//               <div className="h-110 checkout-form-skeleton rounded"></div>
//             }
//           >
//             <AllRelatedProductsServerData
//               relatedProductsPromise={relatedProductsPromise}
//             />
//           </Suspense>
//         </section>

//         {/* Customer reviews */}
//         <section className="mt-9 w-full">
//           <div className="mx-auto md:mx-0">
//             <span className="font-bold text-lg">Product Preview</span>
//           </div>
//           <Suspense
//             fallback={
//               <div className="mt-3 h-105 checkout-form-skeleton rounded" />
//             }
//           >
//             <CustomerReviewServerDataContent productPromise={productPromise} />
//           </Suspense>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default function Page({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   return <ProductPageContent params={params} />;
// }

// export async function generateStaticParams() {
//   const ProductsName = await getAllProductsName();

//   if (!ProductsName) return [];

//   return ProductsName.map((p) => ({
//     slug: p.product_item_name,
//   }));
// 