import { ProductProps } from "@/lib/types/product-types";

export default function ProductPathTitleContentClientData({ productPathTitle }: {productPathTitle: ProductProps<string | null>}){
    return (
        <><div className="space-x-1 font-medium">
        <span>Home</span>
        <span className="font-bold">&gt;</span>
        <span>Products</span>
        <span className="font-bold">&gt;</span>
        <span className="capitalize">{productPathTitle}</span>
        </div></>
    );
}