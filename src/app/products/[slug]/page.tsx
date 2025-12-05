import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
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
import { CustomerFeedbackProps } from "@/lib/types/customer-feedback-types";
import type { Metadata, ResolvingMetadata } from "next";
import { getBaseUrl } from "@/lib/helper/getBaseUrl";

export const revalidate = 30;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string | string[] }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {

  const { slug } = await params;
  const resolvedSearch = await searchParams;

  const color = Array.isArray(resolvedSearch.color)
    ? resolvedSearch.color[0]
    : resolvedSearch.color;

  const ProductVariants = await getSingleProduct({ slug });

  if (!ProductVariants || !ProductVariants[0]) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable.",
    };
  }

  const product = ProductVariants[0];
  const mainImage = product.product_item_image ?? "/tshirt_placeholder.png";
  console.log("Main Image URL:", mainImage);

  const absoluteImageUrl = mainImage.startsWith("http")
    ? mainImage
    : `${getBaseUrl()}${mainImage}`;

  return {
    title: product.product_item_name![0].toUpperCase() + product.product_item_name?.slice(1)  ?? "Product",
    description: product.product_item_design_features ?? "Check out this product!",
    openGraph: {
      title: product.product_item_name![0].toUpperCase()  + product.product_item_image?.slice(1) ?? "Product",
      description: product.product_item_design_features ?? "",
      url: `https://abante-clothing.vercel.app/products/${slug}${color ? `?color=${color}` : ""}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: product.product_item_name ?? "Product Image",
        },
      ],
      type: "website",
      siteName: "Abante Clothing",
    },
    twitter: {
      title: product.product_item_name![0].toUpperCase() + product.product_item_image?.slice(1) ?? "Product",
      card: "summary_large_image",
      description: product.product_item_design_features ?? "",
      images: [absoluteImageUrl],
    },
  };
}

export default async function Page({ params }: ParamsProps ) {
  const { slug } = await params;
  
   const [ ProductVariants, AllRelatedProducts ] = await Promise.all([
    getSingleProduct({ slug }),
    getAllRelatedProducts(),
  ]);

  if(!ProductVariants || !AllRelatedProducts) return <div className="flex items-center justify-center h-screen"><h1>Error! something wrong on fetching on db</h1></div>

  let CurrentProductFeedbacks: CustomerFeedbackProps[] = [];
  if (ProductVariants[0]?.product_item_ID != null) {
    CurrentProductFeedbacks = await getAllRelatedCustomerProductReview(
      ProductVariants[0].product_item_name as string
    );
  }

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
      <section className="mt-9 w-full"><CustomerProductPreview props={CurrentProductFeedbacks}/></section>
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
