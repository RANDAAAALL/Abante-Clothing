import { getAllRelatedProductsCached } from "@/lib/cache/get-all-related-products-cached";
export const getAllRelatedProducts = () => { return getAllRelatedProductsCached(); }