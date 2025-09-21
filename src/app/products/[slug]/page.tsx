// src/app/products/[slug]/page.tsx
import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
import NavbarContent from "@/components/ui/navbar-section/navbar-content";
import CustomerProductPreview from "@/components/ui/specific-product/customer-product-preview";
import HeroContents from "@/components/ui/specific-product/hero-contents";
import ProductPathTitle from "@/components/ui/specific-product/product-path-title";
import ProductSpecifications from "@/components/ui/specific-product/product-specifications-content";
import { getAllRelatedProducts } from "@/data-access-layer/get-all-products";
import { getSingleProduct } from "@/data-access-layer/get-single-product";
import { getAllProductsName } from "@/data-access-layer/get-all-products-name";
import { ParamsProps } from "@/lib/types/params-types";
import { getAllRelatedCustomerProductReview } from "@/data-access-layer/get-all-related-customer-product-review";

// export const revalidate = 60;

export default async function Page({ params }: ParamsProps ) {
  const { slug } = await params;
  const [ SingleProduct, AllRelatedProducts, AllRelatedCustomerFeedbacks ] = await Promise.all([
    getSingleProduct({slug}),
    getAllRelatedProducts(),
    getAllRelatedCustomerProductReview()
  ]);

  if(!SingleProduct || !AllRelatedProducts || !AllRelatedCustomerFeedbacks ) return <h1>Error! something wrong on fetching on db</h1>

  // console.log("Single Product: ",SingleProduct);
  // console.log("All Products: ",AllProducts);
  // console.log("RelatedCustomerProductReview: ", RelatedCustomerFeedbacks);

  return (
    <>
    <div className="bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">

      {/* nav-bar section */}
      <section className="z-50 sticky top-0"><NavbarContent /></section>

      <main className="mt-10 flex flex-col sm:items-start min-h-screen sm:max-w-4xl w-full mx-auto p-4">
     
      {/* product path title */}
      <section className="mx-auto md:mx-0"><ProductPathTitle productPathTitle={SingleProduct?.product_item_name as string} /></section>

      {/* hero contents */}
      <section className="mt-9 sm:w-full"><HeroContents slug={slug!} props={SingleProduct}/></section>

      {/* product specifications */}
      <section className="mt-9"><ProductSpecifications props={SingleProduct} /></section>

      {/* related products */}
      <span className="mt-9 font-bold text-lg">Related Products</span>
      <section className="sm:mx-auto"><TshirtsImageDescContent flag={true} props={AllRelatedProducts}/></section>

      {/* customer product preview */}
      <section className="mt-9 w-full"><CustomerProductPreview props={AllRelatedCustomerFeedbacks}/></section>
      </main>

      {/* footer section */}
      <footer className="text-sm w-full p-4"><FooterSectionContent className="mt-25" styleName="md:pt-6" /></footer>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const ProductsName = await getAllProductsName();
  // console.log("All Products Name:", ProductsName);

  return ProductsName.map((p) => ({
    slug: p.product_item_name,
  }));
}
