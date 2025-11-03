import React, { useCallback } from "react";
import useAddToCart from "@/hooks/useAddToCart";
import { useAuth } from "@/lib/store/auth";
import { useCartItems } from "@/lib/store/cart-items";
import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function AddToCartAndBuyNowButtonsComponent({
  props,
}: {
  props: ProductProps<Partial<TshirtType>>;
}) {
  const {
    setSelectedItems,
    selectedSizeQtyAndColor,
    selectedSize,
  } = useCartItems();

  const { isAuthenticated } = useAuth();
  const { mutate: addToCart } = useAddToCart();
  const router = useRouter();

  const handleAddToCart = useCallback(() => {
    // console.log("1. add to cart button triggered on component");
    if (!selectedSize) {
      toast.error("Please select a t-shirt size");
      return;
    }

    if (isAuthenticated?.successMessage?.match(/!/)) addToCart({ product: props, selectedSizeQtyAndColor });
    else setSelectedItems(props);
  }, [selectedSize, isAuthenticated, addToCart, props, selectedSizeQtyAndColor, setSelectedItems]);

  const handleBuyNow = useCallback(() => {
    // console.log("buy now button triggered");
    if (!selectedSize) {
      toast.error("Please select a t-shirt size");
      return;
    }

    if (isAuthenticated?.successMessage?.match(/!/)) addToCart({ product: props, selectedSizeQtyAndColor });
    else setSelectedItems(props);

    router.push("/checkout");
  }, [selectedSize, isAuthenticated, addToCart, props, selectedSizeQtyAndColor, setSelectedItems, router]);

  return (
    <>
      <button
        className="cursor-pointer py-2 rounded-sm w-full text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black active:bg-gray-600 dark:active:bg-gray-300"
        onClick={handleAddToCart}>
        Add to Cart
      </button>
      <button className="cursor-pointer py-2 rounded-sm w-full text-sm bg-card-black-background text-white dark:bg-card-white-background dark:text-black active:bg-gray-600 dark:active:bg-gray-300"
        onClick={handleBuyNow}>
        Buy now
      </button>
    </>
  );
}

const AddToCartAndBuyNowButtons = React.memo(AddToCartAndBuyNowButtonsComponent);
export default AddToCartAndBuyNowButtons;
