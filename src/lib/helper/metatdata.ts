import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/helper/getBaseUrl";
import { TshirtType } from "../types/t-shirt-types";

export function buildProductMetadata(
  products: Partial<TshirtType>[] | undefined,
  slug: string,
  colors?: string[]
): Metadata {
  if (!products || products.length === 0) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable.",
    };
  }

  let selectedVariants: Partial<TshirtType>[] = [];
  
  // ff colors are specified, find all matching variants
  if (colors && colors.length > 0) {
    selectedVariants = products.filter(v => 
      v.product_item_color && 
      colors.some(color => 
        v.product_item_color!.toLowerCase() === color.toLowerCase()
      )
    );
  }
  
  // if no matches or no colors specified, use the first variant
  if (selectedVariants.length === 0) {
    selectedVariants = [products[0]];
  }

  // use the first matching variant for metadata (most platforms show only 1 image)
  const selectedVariant = selectedVariants[0];
  
//   console.log("Selected Variant for Metadata: ", selectedVariant);
  
  // use its image
  const mainImage = selectedVariant.product_item_image ?? "/tshirt_placeholder.png";

  const absoluteImageUrl = mainImage.startsWith("http")
    ? mainImage
    : `${getBaseUrl()}${mainImage}`;

  const capitalizedTitle = selectedVariant.product_item_name
    ? selectedVariant.product_item_name.charAt(0).toUpperCase() +
      selectedVariant.product_item_name.slice(1)
    : "Product";

  // build color-specific title if colors are selected
  let pageTitle = capitalizedTitle;
  let colorParam = "";
  
  if (colors && colors.length > 0) {
    const colorList = colors.join(', ');
    pageTitle = `${capitalizedTitle} (${colorList})`;
    
    // build color query parameter for URL
    if (colors.length === 1) {
      colorParam = `?color=${colors[0]}`;
    } else {
      colorParam = `?${colors.map(c => `color=${c}`).join('&')}`;
    }
  }

  return {
    title: pageTitle,
    description: selectedVariant.product_item_design_features ?? "Check out this product!",
    openGraph: {
      title: pageTitle,
      description: selectedVariant.product_item_design_features ?? "",
      url: `https://abante-clothing.vercel.app/products/${slug}${colorParam}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${selectedVariant.product_item_name ?? "Product"} in ${selectedVariant.product_item_color ?? "selected color"}`,
        },
      ],
      type: "website",
      siteName: "Abante Clothing",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: selectedVariant.product_item_design_features ?? "",
      images: [absoluteImageUrl],
    },
  };
}