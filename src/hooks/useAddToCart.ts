
import { AddToCartURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { getDiscountedPrice } from "@/lib/helper/get-discounted-price";
import { AddToCartPayload } from "@/lib/interface/add-to-cart";
import { CartItemsProps } from "@/lib/types/cart-items-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export default function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<
    CartItemsProps, 
    Error,
    AddToCartPayload,
    { previousData?: CartItemsProps[]; tempId?: number }
  >({
    mutationFn: async ({ product, selectedSizeQtyAndColor }: AddToCartPayload) => {
      // console.log("Client ->  ", product)
      // console.log("🔄 addToCart MutationFN triggered");
      const res = await fetchWithCsrf(`${AddToCartURL}`, {
        method: "POST",
        body: JSON.stringify({ product, selectedSizeQtyAndColor }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");

      const data: CartItemsProps = await res.json();
      return data;
    },

    onMutate: async ({ product, selectedSizeQtyAndColor }) => {
      const discountedPrice = Math.round(getDiscountedPrice(product.product_item_price ?? 0, product.product_item_discount ?? 0));
      await queryClient.cancelQueries({ queryKey: ["get-cart"] });
      
      const previousData = queryClient.getQueryData<CartItemsProps[]>(["get-cart"]);
      const tempId = -Date.now();

      const newItem: Partial<CartItemsProps> = {
        cart_item_ID: tempId, 
        user_ID: -1,
        cart_item_color: selectedSizeQtyAndColor.color ?? "",
        cart_item_name: product.product_item_name ?? "",
        cart_item_price: discountedPrice,
        cart_item_qty: selectedSizeQtyAndColor.qty,
        cart_item_size: selectedSizeQtyAndColor.size,
        cart_item_image: product.product_item_image ?? "/images/png/tshirt_placeholder.png",
        cart_item_total: discountedPrice * selectedSizeQtyAndColor.qty,
        product_item_ID: product.product_item_ID!,
        cart_item_date: new Date(),
      };

      // console.log("Client New Item->  ", newItem);
      queryClient.setQueryData<Partial<CartItemsProps>[]>(["get-cart"], (old = []) => {
        const newData = [...old, newItem];
        return newData;
      });

      return { previousData, tempId };
    },

    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["get-cart"], context.previousData);
      }
    },

    onSuccess: (serverItem, variables, context) => {
      queryClient.setQueryData<CartItemsProps[]>(["get-cart"], (old = []) => {
        if (!old) return [serverItem];
        
    
        // Check if this item already exists in the cart (same product + size + color)
        const existingItemIndex = old.findIndex(item => 
          item.product_item_ID === serverItem.product_item_ID &&
          item.cart_item_size === serverItem.cart_item_size &&
          item.cart_item_color === serverItem.cart_item_color &&
          item.cart_item_ID > 0 // Only check real items, not temporary ones
        );
    
        if (existingItemIndex !== -1) {
          // Item already exists - update the quantity and total
          const updatedData = [...old];
          updatedData[existingItemIndex] = serverItem; // Replace with server data
          
          // Also remove the temporary item if it exists
          const finalData = updatedData.filter(item => item.cart_item_ID !== context?.tempId);
          return finalData;
        } else {
          // Item doesn't exist - replace temporary item with server item
          const updatedData = old.map(item => 
            item.cart_item_ID === context?.tempId ? serverItem : item
          );
          return updatedData;
        }
      });
    },
  });
}