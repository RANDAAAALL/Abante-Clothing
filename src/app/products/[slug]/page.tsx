// src/app/products/[slug]/page.tsx
import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";
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

  if (!product) {
    return <h1>Product not found</h1>;
  }

  // <p>Price: {product.product_item_price?.toString()}</p>
  // <p>Size: {product.product_item_size!.split(/\s+/)[0]}</p>

  return (
    <>
    <div className="transition duration-500 ease-in-out bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto">

      {/* nav-bar section */}
      <header className="rounded-b-lg sticky top-0 z-50 bg-white-background/20 dark:bg-black-background/20 backdrop-blur-md shadow-md w-full font-medium gap-10 flex p-4 max-w-screen-xl md:justify-evenly md:items-center md:mx-auto"><NavbarContent /></header>

      <main className=" flex flex-col items-center md:items-start min-h-screen md:max-w-4xl w-full mx-auto py-11 sm:py-13">
     
      {/* product path title */}
      <section className="sm:px-6"><ProductPathTitle productPathTitle={product.product_item_name} /></section>

      {/* hero contents */}
      <section className="mt-9 sm:mt-15"><HeroContents props={product}/></section>

      {/* product specifications */}
      <section className="mt-9"><ProductSpecifications props={product} /></section>

      {/* related products */}
      <section></section>

      {/* customer product preview */}
      <section></section>
      </main>

      {/* footer section */}
      <footer className="text-sm w-full p-4 md:p-6"><FooterSectionContent className="mt-55" styleName="md:pt-6" /></footer>

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
