"use client";
import { useMemo } from "react";
import Fuse from "fuse.js";
import AllProductsWithPagination from "./all-products-with-pagination";
import { AllProductsClientContentProps } from "@/lib/interface/all-products-client-content";

export default function AllProductsClientContent({
  initialProducts,
  query = "",
  sort = "name-asc",
}: AllProductsClientContentProps) {
  const filteredProducts = useMemo(() => {
    // console.log("Filtering products client-side:", {
    //   query,
    //   sort,
    //   initialCount: initialProducts.length,
    // });

    let items = [...initialProducts];

    if (query) {
      const fuse = new Fuse(items, {
        keys: [
          { name: "product_item_name", weight: 0.5 },
          { name: "product_item_color", weight: 0.3 },
          { name: "product_item_price", weight: 0.2 },
        ],
        threshold: 0.4,
      });
      const results = fuse.search(query);
      items = results.map((r) => r.item);
    }

    // sort
    items = items.sort((a, b) => {
      switch (sort) {
        case "name-desc":
          return (b.product_item_name || "").localeCompare(
            a.product_item_name || ""
          );
        case "price-asc":
          return (a.product_item_price || 0) - (b.product_item_price || 0);
        case "price-desc":
          return (b.product_item_price || 0) - (a.product_item_price || 0);
        case "name-asc":
        default:
          return (a.product_item_name || "").localeCompare(
            b.product_item_name || ""
          );
      }
    });

    // console.log("Filtered products count:", items.length);
    return items;
  }, [initialProducts, query, sort]);

  return <AllProductsWithPagination props={filteredProducts} />;
}
