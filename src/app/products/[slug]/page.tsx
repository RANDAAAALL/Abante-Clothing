// src/app/products/[slug]/page.tsx
import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";
import CustomerProductPreview from "@/components/ui/specific-product/customer-product-preview";
import HeroContents from "@/components/ui/specific-product/hero-contents";
import ProductPathTitle from "@/components/ui/specific-product/product-path-title";
import ProductSpecifications from "@/components/ui/specific-product/product-specifications";
import { getAllProducts } from "@/lib/db/get-all-products";
import { getSingleProduct } from "@/lib/db/get-single-product";
import { getAllProductsName } from "@/lib/db/get-all-products-name";
import { ParamsProps } from "@/lib/types/params-types";
import { ProductsNameProps } from "@/lib/types/product-types";
import { getRelatedCustomerProductReview } from "@/lib/db/get-customer-product-review.";

// export const revalidate = 60;

export default async function Page({ params }: ParamsProps ) {
  const { slug } = await params;
  const [ SingleProduct, AllProducts, RelatedCustomerFeedbacks ] = await Promise.all([
    getSingleProduct({slug}),
    getAllProducts({slug}),
    getRelatedCustomerProductReview()
  ]);

  if(!SingleProduct || !AllProducts || !RelatedCustomerFeedbacks ) return <h1>Erro! something wrong on fetching on db</h1>

  console.log("Single Product: ",SingleProduct);
  console.log("All Products: ",AllProducts);
  console.log("RelatedCustomerProductReview: ", RelatedCustomerFeedbacks);

  return (
    <>
    <div className="transition duration-500 ease-in-out bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">

      {/* nav-bar section */}
      <section className="z-50 sticky top-0"><NavbarContent /></section>

      <main className=" flex flex-col sm:items-start min-h-screen md:max-w-4xl w-full mx-auto py-11 sm:py-13">
     
      {/* product path title */}
      <section className="sm:px-6"><ProductPathTitle productPathTitle={SingleProduct.product_item_name} /></section>

      {/* hero contents */}
      <section className="mt-9 sm:mt-15"><HeroContents props={SingleProduct}/></section>

      {/* product specifications */}
      <section className="mt-9"><ProductSpecifications props={SingleProduct} /></section>

      {/* related products */}
      <span className="mt-9 px-5 font-bold text-lg">Related Products</span>
      <section className="sm:mx-auto"><TshirtsImageDescContent flag={true} tshirt={AllProducts} /></section>

      {/* customer product preview */}
      <section className="mt-9 px-5"><CustomerProductPreview props={RelatedCustomerFeedbacks}/></section>
      </main>

      {/* footer section */}
      <footer className="text-sm w-full p-4 md:p-6"><FooterSectionContent styleName="md:pt-6" /></footer>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const ProductsName = await getAllProductsName();
  // console.log("All Products Name:", ProductsName);

  return ProductsName.map((p: ProductsNameProps) => ({
    slug: p.product_item_name,
  }));
}
