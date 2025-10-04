import useAddToCart from "@/hooks/useAddToCart";
import useMe from "@/hooks/useMe";
import { useCartItems } from "@/lib/store/cart-items";
import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";
import { useRouter } from "next/navigation";

export default function AddToCartAndBuyNowButtons({props}: {props: ProductProps<Partial<TshirtType>>}){
    const { setSelectedItems,
            selectedSizeAndQty,
            selectedSize,
            // resetSelectedItem 
    } = useCartItems();
    const { data } = useMe();    

    const { mutate: addToCart } = useAddToCart();
    
    const router = useRouter();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a t-shirt size");
            return;
        } 

        if(data) addToCart({product: props,selectedSizeAndQty})            
        else setSelectedItems(props);

        // resetSelectedItem();
    }

    const handleBuyNow = () => {
        if(!selectedSize){
            alert("Please select a t-shirt size");
            return;
        }

        if(data) addToCart({product: props,selectedSizeAndQty})            
        else setSelectedItems(props);

        // resetSelectedItem();
        router.push("/checkout");
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