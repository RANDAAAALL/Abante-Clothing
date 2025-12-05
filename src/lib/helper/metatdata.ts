import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/helper/getBaseUrl";
import { TshirtType } from "../types/t-shirt-types";

export function buildProductMetadata(product: Partial<TshirtType>, slug: string, color?: string): Metadata {
  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable.",
    };
  }

  const mainImage = product.product_item_image ?? "/tshirt_placeholder.png";
  const absoluteImageUrl = mainImage.startsWith("http")
    ? mainImage
    : `${getBaseUrl()}${mainImage}`;

  const capitalizedTitle = product.product_item_name
    ? product.product_item_name.charAt(0).toUpperCase() +
      product.product_item_name.slice(1)
    : "Product";

  return {
    title: capitalizedTitle,
    description: product.product_item_design_features ?? "Check out this product!",
    openGraph: {
      title: capitalizedTitle,
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
      card: "summary_large_image",
      title: capitalizedTitle,
      description: product.product_item_design_features ?? "",
      images: [absoluteImageUrl],
    },
  };
}
