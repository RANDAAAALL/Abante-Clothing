import { getAllRelatedProducts } from "@/data-access-layer/get-all-products";
import { SearchQuerytypes } from "./types/search-query-types";
import Fuse from "fuse.js"

export const filteredProductItems = async ({query}: SearchQuerytypes) =>{
    const items = await getAllRelatedProducts();
    if (!query) return items;

    const fuse = new Fuse(items, {
        keys: [
          { name: "product_item_name", weight: 0.5 },
          { name: "product_item_color", weight: 0.3 },
          { name: "product_item_price", weight: 0.2 },
        ],
        threshold: 0.4,
      });
      
  const results = fuse.search(query);

  return results.map(result => result.item); 
};
