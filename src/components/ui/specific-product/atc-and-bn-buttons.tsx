import { useCartItems } from "@/lib/store/cart-items";
import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";
import { useRouter } from "next/navigation";

export default function AddToCartAndBuyNowButtons({props}: {props: ProductProps<Partial<TshirtType>>}){
    const { setSelectedItems, selectedSize } = useCartItems();    
    const router = useRouter();

    const handleAddToCart = () => {
        if (!selectedSize) alert("Please select a t-shirt size");
        setSelectedItems(props);
    }

    const handleBuyNow = () => {
        if(!selectedSize) alert("Please select a t-shirt size");

        // right now, we are just redirecting to login page as of now
        setSelectedItems(props);
        router.push("/login");
    }
    return (
        <>
        <button className="cursor-pointer py-2 rounded-sm w-full text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black" onClick={() => handleAddToCart()}>Add to Cart</button>
        <button className="cursor-pointer py-2 rounded-sm w-full text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black" onClick={() => handleBuyNow()}>Buy now</button>
        </>
    );
}