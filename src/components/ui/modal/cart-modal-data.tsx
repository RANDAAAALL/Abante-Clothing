"use client";
import { SelectedItemProps, useCartItemModal, useCartItems } from "@/lib/store/cart-items";
import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ComputeTotalPriceWithQty } from "@/lib/helper/compute-total-price";
import useGetCart from "@/hooks/useGetCart";
import useDeleteCart from "@/hooks/useDeleteCart";
import { useQueryClient } from "@tanstack/react-query";
import isCartItem from "@/lib/helper/isCartItem";

export default function CartModalData() {
  const { selectedItem, removeSelectedItem } = useCartItems();
  const { CloseModal } = useCartItemModal();
  const { data, isLoading } = useGetCart();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deleteData } = useDeleteCart({
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
  
  const totalPrice = useMemo(() => {
    const source = data && data.length > 0 ? data : selectedItem;
    if (!source || source.length === 0) return 0;
  
    return ComputeTotalPriceWithQty(source);
  }, [data, selectedItem]);
  

  // simulate loading 
  if(data && isLoading) return <p className="text-sm text-black dark:text-white h-50 flex items-center justify-center">Loading...</p>

  // checks if user is logged in or not
  // if its logged in means: we will use the data from the api route
  // if its not logged in means: we wil use the data from the localStorage
  const payload = data ? data : selectedItem;

  return (
        <>
          {payload?.length >= 1 ? (
            <>
              <div className="w-full flex flex-col p-2 max-h-75 overflow-y-auto snap-y">
                {payload.map((item: CartItemsProps | SelectedItemProps, i: number) => (
                  <React.Fragment key={i}>
                    <div className="relative flex items-center w-full justify-between px-2 snap-center">
                      <Image
                        className="mt-5 mb-4"
                        src= {`${isCartItem(item)
                           ? item?.cart_item_image ??"/images/png/tshirt_placeholder.png" :
                          item.product?.product_item_image ??
                          "/images/png/tshirt_placeholder.png"}`}
                          width={100}
                          height={100}
                          alt={isCartItem(item) ?
                           `${item?.cart_item_ID}-${item?.cart_item_name}` :
                           `${item.product?.product_item_ID}-${item.product?.product_item_name}`}/>

                      <div className="flex flex-1 ml-5 flex-col font-medium text-sm md:text-md">
                        <p className="capitalize">
                          {isCartItem(item) ? 
                          `${item?.cart_item_name} - ${item?.cart_item_size}` :
                          `${item.product?.product_item_name} - ${item?.selectedSizeAndQty?.size}`}
                        </p>
                        <p>
                          {isCartItem(item) ?
                          `${item?.cart_item_qty} x P${item?.cart_item_price}` : 
                          `${item?.selectedSizeAndQty?.qty} x P${item.product?.product_item_price}`}
                        </p>
                      </div>

                      <button
                        className="text-black dark:text-white font-bold cursor-pointer"
                        onClick={() => {
                        if(isCartItem(item)) deleteData(item?.cart_item_ID.toString())
                        else removeSelectedItem(i)}}>
                        x
                      </button>
                    </div>
                    <hr className="border-black dark:border-white border-t-2" />
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-8 mx-auto text-sm text-center space-y-3.5">
                <p className="font-bold">Total: P{totalPrice.toLocaleString("en-Ph")}</p>
                <button
                  onClick={() => {
                    CloseModal();
                    router.push("/checkout");
                  }}
                  className="cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-sm py-3 px-7">
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-black dark:text-white h-50 flex items-center justify-center">
              Your cart is currently empty.
            </p>
        )}
      </>
  );
}
