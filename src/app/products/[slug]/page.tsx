// src/app/products/[slug]/page.tsx
import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import TshirtsImageDescContent from "@/components/ui/main-section/weekend-offers-content/t-shirts-image-desc-content";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";
import CustomerProductPreview from "@/components/ui/specific-product/customer-product-preview";
import HeroContents from "@/components/ui/specific-product/hero-contents";
import ProductPathTitle from "@/components/ui/specific-product/product-path-title";
import ProductSpecifications from "@/components/ui/specific-product/product-specifications";
import prisma from "@/lib/prisma/prisma";
import { ProductsNameProps } from "@/lib/types/product-types";


export default async function Page({ params }: { params: Promise<{ slug: string | null }> }) {
  const { slug } = await params;

  const product = await prisma.product_items.findFirst({
    where: { product_item_name: slug },
    select: {
      product_item_ID: true,
      product_item_name: true,
      product_item_price: true,
      product_item_image: true,
      product_item_back_image: true,
      product_item_size: true,
      product_item_material: true,
      product_item_construction: true,
      product_item_design_features: true,
    },
  });

  const allProducts = await prisma.product_items.findMany({
    select: {
      product_item_ID: true,
      product_item_name: true,
      product_item_price: true,
      product_item_image: true,
      product_item_size: true,
    },
  });

  if (!product || !allProducts) {
    return <h1>Product not found</h1>;
  }

  const safeAllProducts = allProducts.map((p) => ({
    ...p,
    product_item_price: p.product_item_price?.toString()
  }))

  return (
    <>
    <div className="transition duration-500 ease-in-out bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">

      {/* nav-bar section */}
      <section className="z-50 sticky top-0"><NavbarContent /></section>

      <main className=" flex flex-col sm:items-start min-h-screen md:max-w-4xl w-full mx-auto py-11 sm:py-13">
     
      {/* product path title */}
      <section className="sm:px-6"><ProductPathTitle productPathTitle={product.product_item_name} /></section>

      {/* hero contents */}
      <section className="mt-9 sm:mt-15"><HeroContents props={product}/></section>

      {/* product specifications */}
      <section className="mt-9"><ProductSpecifications props={product} /></section>

      {/* related products */}
      <span className="mt-9 px-5 font-bold text-lg">Related Products</span>
      <section className="sm:mx-auto"><TshirtsImageDescContent flag={true} tshirt={safeAllProducts} /></section>

      {/* customer product preview */}
      <section className="mt-9 px-5"><CustomerProductPreview /></section>
      </main>

      {/* footer section */}
      <footer className="text-sm w-full p-4 md:p-6"><FooterSectionContent className="" styleName="md:pt-6" /></footer>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const products = await prisma.product_items.findMany({
    select: { product_item_name: true },
  });

  return products.map((p: ProductsNameProps) => ({
    slug: p.product_item_name,
  }));
}
