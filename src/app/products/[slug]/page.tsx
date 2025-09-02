// src/app/products/[slug]/page.tsx
import prisma from "@/lib/prisma/prisma";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = parseInt(slug, 10);

  const product = await prisma.product_items.findFirst({
    where: { product_item_ID: id },
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
      <p>Price: {!product.product_item_price}</p>
      <p>Size: {product.product_item_size}</p>
    </>
  );
}

export async function generateStaticParams() {
  const products = await prisma.product_items.findMany({
    select: { product_item_ID: true },
  });

  return products.map((p) => ({
    slug: p.product_item_ID.toString(),
  }));
}
