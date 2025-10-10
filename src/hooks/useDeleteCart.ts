import { DeleteCartURL } from "@/lib/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cart_item_id: string) => {
      const res = await fetch(`${DeleteCartURL}/${cart_item_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
    },

    onMutate: async (cart_item_id: string) => {
      await queryClient.cancelQueries({ queryKey: ["get-cart"] });
      const previousData = queryClient.getQueryData<CartItemsProps[]>(["get-cart"]);
  
      queryClient.setQueryData(
        ["get-cart"],
        previousData?.filter(item => item.cart_item_ID !== Number(cart_item_id))
      );
  
      return { previousData };
    },
    onError: (err, cart_item_id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["get-cart"], context.previousData);
      } 
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get-cart"] });
    }
  });
}
