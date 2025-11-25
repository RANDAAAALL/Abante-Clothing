import { SearchQuerytypes } from "../types/search-query-types";
import Fuse from "fuse.js";
import { getAllProductsCached } from "../cache/get-all-products";

export const filteredProductItems = async ({
  query,
  sort,
}: SearchQuerytypes) => {
  const items = await getAllProductsCached();

  if (!items || items.length === 0) return [];

  let filteredItems = [...items];

  // Apply search query
  if (query) {
    const fuse = new Fuse(filteredItems, {
      keys: [
        { name: "product_item_name", weight: 0.5 },
        { name: "product_item_color", weight: 0.3 },
        { name: "product_item_price", weight: 0.2 },
      ],
      threshold: 0.4,
    });

    const results = fuse.search(query);
    filteredItems = results.map((r) => r.item);
  }

  // Apply sorting
  filteredItems = filteredItems.sort((a, b) => {
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

  return filteredItems;
};
