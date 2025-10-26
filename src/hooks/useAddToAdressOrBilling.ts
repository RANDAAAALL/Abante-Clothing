import { AddToAddressOrBillingURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { QueryClient, useMutation } from "@tanstack/react-query";

export default function useAddToAddressOrBilling(){
    const queryClient = new QueryClient();

    return useMutation({
        mutationFn: async ({  }) => {
            const res = await fetchWithCsrf(`${AddToAddressOrBillingURL}`, {
                method: "POST",
                body: JSON.stringify({  })
            });
        }
    })
}