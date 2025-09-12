import ViewAllProductsContent from "@/components/ui/view-all-products/view-all-products-content";
import { ViewAllProductsContentProps } from "@/lib/types/view-all-products-types";

export default function ViewAllProducts({searchParams}: ViewAllProductsContentProps){
    return ( <><ViewAllProductsContent searchParams={searchParams} /></> );
}