import { filteredProductItems } from "@/lib/helper/filtered-product-items";
import AllProductsWithPagination from "./all-products-with-pagination";

export default async function AllProductsWithPaginationContent({ query }: { query: string }){
    const data = await filteredProductItems({query});
    return <AllProductsWithPagination  props={data!}/>;
}