import ViewAllProductsContent from "@/components/ui/all-products/all-products-content";
import { AllProductsContentProps } from "@/lib/types/view-all-products-types";

export default function ViewAllProducts({searchParams}: AllProductsContentProps){
    return ( <><ViewAllProductsContent searchParams={searchParams} /></> );
}