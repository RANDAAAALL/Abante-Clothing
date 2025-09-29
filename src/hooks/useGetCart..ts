"use client"
import { GetCartURL } from "@/lib/config";
import { useQuery } from "@tanstack/react-query";

export default function useGetCart(){
    return useQuery({queryKey: ["get-cart"],
    queryFn: async () => {
        console.log("Fetching cart items....")
        const res = await fetch(`${GetCartURL}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        return res.json();
    },
    networkMode: "always",
    refetchOnWindowFocus: false,  
    refetchOnReconnect: false,   
    retry: false,     
    staleTime: 0, 
    });
    
}