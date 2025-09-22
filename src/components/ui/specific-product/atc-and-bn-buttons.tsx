import { useCartItems } from "@/lib/store/cart-items";
import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";
import { useRouter } from "next/navigation";

export default function AddToCartAndBuyNowButtons({props}: {props: ProductProps<Partial<TshirtType>>}){
    const { setSelectedItems, selectedSize, resetSelectedItem } = useCartItems();    
    const router = useRouter();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a t-shirt size");
            return;
        } 
        setSelectedItems(props);
        resetSelectedItem();
    }

    const handleBuyNow = () => {
        if(!selectedSize){
            alert("Please select a t-shirt size");
            return;
        }
    
        // right now, we are just redirecting to login page as of now
        setSelectedItems(props);
        resetSelectedItem();
        router.push("/login");
    }

    return (
        <>
        <button className="cursor-pointer py-2 rounded-sm w-full text-sm bg-card-black-background text-white 
            dark:bg-card-white-background dark:text-black active:bg-gray-600 dark:active:bg-gray-300" onClick={handleAddToCart}>Add to Cart</button>
        <button className="cursor-pointer py-2 rounded-sm w-full text-sm bg-card-black-background text-white 
            dark:bg-card-white-background dark:text-black active:bg-gray-600 dark:active:bg-gray-300" onClick={handleBuyNow}>Buy now</button>
        </>
    );
}