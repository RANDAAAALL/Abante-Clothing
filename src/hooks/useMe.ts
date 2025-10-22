"use client"
import { MeURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useMe(){
    const router = useRouter();
    const { setIsOpen } = useMenuBarStore();
    const queryClient = useQueryClient();

    const { data, error, isError, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: async () =>  { 
            const res = await fetchWithCsrf(`${MeURL}`);
            if(!res.ok) throw new Error("Failed to fetch user data");
            return res.json();
        },
        networkMode: "always",
        refetchOnWindowFocus: false,  
        refetchOnReconnect: false,   
        retry: false,     
        staleTime: 5 * 60 * 1000, // it will stale for 5mins longer
    });

    // listen for logout event from other tabs
    useEffect(() => {
        const bc = new BroadcastChannel("auth");
        bc.onmessage = (event) => {
        if (event.data?.type === "LOGOUT") {
            queryClient.removeQueries({ queryKey: ["me"] });
            router.push("/login");
            router.refresh();
            setIsOpen(false);
        }
        };
        return () => bc.close();
    }, [router, setIsOpen, queryClient]);

    return {
        data,
        error,
        isError,
        isLoading
    }
}