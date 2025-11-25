import { getAllProductsCached } from "@/lib/cache/get-all-products";
import AllProductsClientContent from "./all-products-with-pagination-content";

export default async function AllProductsServerData({ query, sort }: { query: string; sort: string }) {
    const allProducts = await getAllProductsCached();
    
    return (
      <section>
        <AllProductsClientContent
          initialProducts={allProducts}
          query={query}
          sort={sort}
        />
      </section>
    );
  }