import { AddToCartURL } from "@/lib/config";
import { AddToCartPayload } from "@/lib/interface/add-to-cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<
    CartItemsProps, 
    Error,
    AddToCartPayload,
    { previousData?: CartItemsProps[]}>({

    // sends request to server
    mutationFn: async ({ product, selectedSizeAndQty }: AddToCartPayload) => {
      const res = await fetch(`${AddToCartURL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, selectedSizeAndQty }),
      });

      
      console.log("useAddToCart Triggered");
      if (!res.ok) throw new Error("Failed to add to cart");

      const data: CartItemsProps = await res.json();

      queryClient.invalidateQueries({ queryKey: ["get-cart"] })
      return data;
    },

    // // optimistic update
    onMutate: async ({ product, selectedSizeAndQty }) => {
      await queryClient.cancelQueries({ queryKey: ["get-cart"] });
      const previousData = queryClient.getQueryData<CartItemsProps[]>(["get-cart"]);

      // temporary item for instant ui 
      const newItem: CartItemsProps = {
        cart_item_ID: Date.now(), 
        user_ID: Number(Date.now()),
        cart_item_color: product.product_item_color ?? "",
        cart_item_name: product.product_item_name ?? "",
        cart_item_price: product.product_item_price ?? 0,
        cart_item_qty: selectedSizeAndQty.qty,
        cart_item_size: selectedSizeAndQty.size,
        cart_item_image: product.product_item_image ?? "/images/png/tshirt_placeholder.png",
        cart_item_total: (product.product_item_price ?? 0) * selectedSizeAndQty.qty,
        product_item_ID: product.product_item_ID!,
        cart_item_date: new Date(),
      };
      

      queryClient.setQueryData<CartItemsProps[]>(["get-cart"], (old = []) => [...old, newItem]);

      return { previousData }; // for rollback
    },

    // rollback on error
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["get-cart"], context.previousData);
      }
    },

    // merge server response
    onSuccess: (serverItem, { product, selectedSizeAndQty }) => {
      queryClient.setQueryData<CartItemsProps[]>(["get-cart"], (old = []) => {
        
        // replace temporary item with real server item
        const exists = old.some(
          item =>
            item.product_item_ID === product.product_item_ID &&
            item.cart_item_size === selectedSizeAndQty.size
        );

        if (exists) {
          return old.map(item =>
            item.product_item_ID === product.product_item_ID &&
            item.cart_item_size === selectedSizeAndQty.size
              ? serverItem
              : item
          );
        }

        // if not in old array "unlikely", just add it
        return [...old, serverItem];
      });
    },
  });
}
