"use client";
import { SelectedItemProps, useCartItemModal, useCartItems } from "@/lib/store/cart-items";
import React, { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { computeItems } from "@/lib/helper/compute-items";
import useGetCart from "@/hooks/useGetCart";
import useDeleteCart from "@/hooks/useDeleteCart";
import isCartItem from "@/lib/helper/isCartItem";
import { CartItemsProps } from "@/lib/types/cart-items-types";
import { getDiscountedPrice } from "@/lib/helper/get-discounted-price";
export default function CartModalData() {
  const { selectedItem, removeSelectedItem } = useCartItems();
  const { CloseModal } = useCartItemModal();
  const { data, isLoading } = useGetCart();
  const router = useRouter();

  const { mutate: deleteData } = useDeleteCart();
  const res = useMemo(() => {
    const source = data && data.length > 0 ? data : selectedItem;
    // console.log("SelectedItem: " ,selectedItem)
    // console.log("Data: ", data);
    if (!source || source.length === 0) {
      return {
        subTotalPriceResult: 0,
        overallQtyResult: 0,
        overallPriceResult: 0,
      };
    }
    
    const computed = computeItems(source);
    return computed;
  }, [data, selectedItem]);
  
  if (isLoading) return <p className="text-sm text-black dark:text-white h-50 flex items-center justify-center">Loading...</p>;
  const payload = data ? data as CartItemsProps[] : selectedItem;
  
  return (
        <>
          {payload?.length >= 1 ? (
            <>
              <div className="w-full flex flex-col p-2 max-h-75 overflow-y-auto snap-y">
                {payload.map((item, i: number) => (
                  <React.Fragment key={i}>
                    <div className="relative flex items-center w-full justify-between px-2 snap-center">
                      <Image
                        className="mt-5 mb-4"
                        src= {`${isCartItem(item)
                           ? item?.cart_item_image ??"/images/png/tshirt_placeholder.png" :
                          item.product?.product_item_image ?? "/images/png/tshirt_placeholder.png"}`}
                          width={100}
                          height={100}
                          alt={isCartItem(item) ?
                           `${item?.cart_item_ID}-${item?.cart_item_name}` :
                           `${item.product?.product_item_ID}-${item.product?.product_item_name}`}/>

                        <div className="flex flex-1 ml-5 space-y-1 flex-col font-medium text-sm md:text-md">
                          <p className="capitalize">
                            {isCartItem(item) 
                              ? `${item?.cart_item_name} - ${item?.cart_item_size}` 
                              : `${item.product?.product_item_name} - ${item?.selectedSizeQtyAndColor?.size}`
                            }
                          </p>

                          <p>
                            {isCartItem(item)
                              ? `${item?.cart_item_qty} x P${getDiscountedPrice(item?.cart_item_price ?? 0, item?.cart_item_discount ?? 0)}`
                              : `${item?.selectedSizeQtyAndColor?.qty} x P${getDiscountedPrice(item?.product.product_item_price ?? 0, item?.product.product_item_discount ?? 0)}`
                            }
                          </p>

                          <p className="capitalize">
                            {isCartItem(item) ? `${item?.cart_item_color}` : `${item?.selectedSizeQtyAndColor?.color}`}
                          </p>
                        </div>

                      <button
                        className="text-black dark:text-white font-bold cursor-pointer absolute right-1 top-1"
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
                <p className="font-bold">Total: P{res?.subTotalPriceResult.toLocaleString("en-Ph")}</p>
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
              Your cart is currently empty
            </p>
        )}
      </>
  );
}
