import { filteredProductItems } from "@/lib/helper/filtered-product-items";
import AllProductsWithPagination from "./all-products-with-pagination";

export default async function AllProductsWithPaginationContent({
  query,
  sort,
}: {
  query: string;
  sort?: string;
}) {
  const data = await filteredProductItems({ query, sort });
  return <AllProductsWithPagination props={data || []} />;
}
