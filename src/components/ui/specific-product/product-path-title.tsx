import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";

export default function ProductPathTitle({ productPathTitle }: {productPathTitle: ProductProps<string | null>}){
    return (
        <><div className="flex justify-center space-x-1 font-medium">
        <span>Home</span>
        <span className="font-bold">&gt;</span>
        <span>Products</span>
        <span className="font-bold">&gt;</span>
        <span className="capitalize">{productPathTitle}</span>
        </div></>
    );
}