import { getAllProducts } from "@/data-access-layer/get-all-products";
import { SearchQuerytypes } from "./types/search-query-types";

export const filteredProductItems = async ({query}: SearchQuerytypes) =>{
    const items = await getAllProducts();
    return query ? items.filter((item, _ ) => item?.product_item_name?.toLowerCase().includes(query.toLowerCase())) : items;
}