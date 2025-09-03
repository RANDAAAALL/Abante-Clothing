// src/app/products/[slug]/page.tsx
import prisma from "@/lib/prisma/prisma";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await prisma.product_items.findFirst({
    where: { product_item_name: slug },
    select: {
      product_item_ID: true,
      product_item_name: true,
      product_item_price: true,
      product_item_image: true,
      product_item_size: true,
    },
  });

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <>
      <h1>
        {product.product_item_name} - {product.product_item_ID}
      </h1>
      <p>Price: {product.product_item_price?.toString()}</p>
      <p>Size: {product.product_item_size!.split(/\s+/)[0]}</p>
    </>
  );
}

export async function generateStaticParams() {
  const products = await prisma.product_items.findMany({
    select: { product_item_name: true },
  });

  return products.map((p) => ({
    slug: p.product_item_name,
  }));
}
