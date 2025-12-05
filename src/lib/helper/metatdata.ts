// lib/helper/metadata.ts
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/helper/getBaseUrl";
import { TshirtType } from "../types/t-shirt-types";

export function buildProductMetadata(
  product: Partial<TshirtType> | undefined, 
  slug: string
): Metadata {
  if (!product) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable.",
    };
  }

  // Use the main image
  const mainImage = product.product_item_image ?? "/tshirt_placeholder.png";
  
  // Only call getBaseUrl() if needed
  const absoluteImageUrl = mainImage.startsWith("http")
    ? mainImage
    : `${getBaseUrl()}${mainImage}`;

  const productName = product.product_item_name || "Product";
  const capitalizedTitle = productName.charAt(0).toUpperCase() + productName.slice(1);

  // Create a better description
  const description = product.product_item_design_features 
    ? `${productName} - ${product.product_item_design_features.substring(0, 150)}...`
    : `Buy ${productName} from Abante Clothing. Premium quality, great design.`;

  return {
    title: `${capitalizedTitle} | Abante Clothing`,
    description,
    openGraph: {
      title: capitalizedTitle,
      description,
      url: `https://abante-clothing.vercel.app/products/${slug}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${productName} - Abante Clothing`,
        },
      ],
      type: "website",
      siteName: "Abante Clothing",
    },
    twitter: {
      card: "summary_large_image",
      title: capitalizedTitle,
      description,
      images: [absoluteImageUrl],
    },
    // Optional: Add more metadata
    keywords: [
      productName,
      "t-shirt",
      "clothing",
      "fashion",
      "abante",
      ...(product.product_item_color ? [product.product_item_color] : []),
      ...(product.product_item_material ? [product.product_item_material.split(' ')[0]] : []),
    ],
  };
}