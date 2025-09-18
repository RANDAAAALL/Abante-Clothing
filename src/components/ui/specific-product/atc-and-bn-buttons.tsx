import { useCartItems } from "@/lib/store/cart-items";
import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";

export default function AddToCartAndBuyNowButtons({props}: {props: ProductProps<Partial<TshirtType>>}){
    const { setSelectedItems, selectedSize } = useCartItems();    

    return (
        <>
        {
         ["Add to Cart", "Buy now"].map((button, i) => (
            <button className="cursor-pointer font-regular py-2 w-full rounded-sm text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black" 
            key={i}
            onClick={
                () => button === "Add to Cart" && !selectedSize 
                ? alert("Please select a t-shirt size")
                : setSelectedItems(props)}>
            {button}
            </button>))
        }
        </>
    );
}