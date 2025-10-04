"use client"
import { GetCartURL } from "@/lib/config";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useGetCart(){
    const queryClient = useQueryClient();
    const router = useRouter();
    const { setIsOpen } = useMenuBarStore();

    const { data, isLoading, error, isError } = useQuery({queryKey: ["get-cart"],
    queryFn: async () => {
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

    // listen for logout event from other tabs
    useEffect(() => {
        const bc = new BroadcastChannel("auth");
        bc.onmessage = (event) => {
        if (event.data?.type === "LOGOUT") {
            queryClient.removeQueries({ queryKey: ["get-cart"] });
            router.push("/login");
            setIsOpen(false);
        }
        };
        return () => bc.close();
        }, [router, setIsOpen, queryClient]);

    return {
        data,
        isLoading,
        error,
        isError
    }
}