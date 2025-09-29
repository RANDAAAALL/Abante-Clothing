import { DeleteCartURL } from "@/lib/config";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export default function useDeleteCart(
  options?: UseMutationOptions<void, Error, string, { previousData?: CartItemsProps[] }>
) {

  return useMutation<void, Error, string, { previousData?: CartItemsProps[] }>({
    mutationFn: async (cart_item_id: string) => {
      const res = await fetch(`${DeleteCartURL}/${cart_item_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
    },
    ...options, // spread in user-provided callbacks
  });
}
