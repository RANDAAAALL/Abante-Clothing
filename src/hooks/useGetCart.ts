"use client";
import { GetCartURL } from "@/lib/config";
import { useCartItems } from "@/lib/store/cart-items";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useGetCart() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setIsOpen } = useMenuBarStore();
  const { resetSelectedItem } = useCartItems();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["get-cart"],
    queryFn: async () => {
      const res = await fetch(`${GetCartURL}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    networkMode: "always",
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Listen for logout event from other tabs
  useEffect(() => {
    const bc = new BroadcastChannel("auth");
    bc.onmessage = (event) => {
      if (event.data?.type === "LOGOUT") {
        queryClient.removeQueries({ queryKey: ["get-cart"] });
        resetSelectedItem();
        sessionStorage.removeItem(`${process.env.NEXT_PUBLIC_STRG_NAME as string}`);
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
    isError,
  };
}
