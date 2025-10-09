import { DeleteAllCartURL } from "@/lib/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteAllCart(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await fetch(`${DeleteAllCartURL}`, { method: "DELETE" });
            if(!res.ok) throw new Error("Failed to delete all items");

            // refresh the get-cart or the cart-item after deleted
            queryClient.invalidateQueries({ queryKey: ['get-cart'] });
        }
    })
}