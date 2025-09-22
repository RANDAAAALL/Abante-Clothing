"use client"
import { useCartItems } from "@/lib/store/cart-items";
import React from "react";
import { useEffect } from "react";
import PreviousButtonIcon from "../carousel/previous-button-icon";
import NavbarCart from "../navbar-section/navbar-cart";
import Image from "next/image";
import Link from "next/link";
import { ProductProps } from "@/lib/types/product-types";
import { TshirtType } from "@/lib/types/t-shirt-types";

export default function CartModal(){
    const { selectedItem, removeSelectedItem ,CloseModal, isOpen } = useCartItems();

    useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; },[isOpen]);
    console.log("Selected Items:" ,selectedItem);

    if(!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
        <div className="bg-card-white-background dark:bg-card-black-background rounded-lg shadow-lg w-[600px] max-w-[90%] p-7 py-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1">
              <p className="font-medium text-xl">Cart</p>
              <NavbarCart flag={true}/>
            </div>
            <button
              className="text-black dark:text-white font-bold cursor-pointer"
              onClick={CloseModal}>
              <PreviousButtonIcon/>
            </button>
          </div>
  
          {selectedItem.length >= 1 ? (
            <>
              <div className="w-full flex flex-col p-2 max-h-75 overflow-y-auto snap-y">
                {selectedItem.map((item, i) => (
                  <React.Fragment key={i}>
                    <div className="relative flex items-center w-full justify-between px-2 snap-center">
                      <Image
                        className="mt-5 mb-4"
                        src={item.product.product_item_image ?? "t-shirt not found"}
                        width={100}
                        height={100}
                        alt={`${item.product.product_item_ID}-${item.product.product_item_back_image}`}
                      />
  
                      <div className="flex flex-1 ml-5 flex-col font-medium text-sm md:text-md">
                        <p className="capitalize">
                          {item.product.product_item_name} - {item.selectedSizeAndQty.size}
                        </p>
                        <p>
                          {item.selectedSizeAndQty.qty} x P
                          {item.product.product_item_price}
                        </p>
                      </div>
  
                      <button className="text-black dark:text-white font-bold cursor-pointer"
                      onClick={() => removeSelectedItem(i)}>x</button>
                    </div>
                    <hr className="border-black dark:border-white border-t-2" />
                  </React.Fragment>
                ))}
              </div>
  
              <div className="mt-8 mx-auto text-sm text-center space-y-3.5">
                <p className="font-bold">
                  Total: P
                  {selectedItem
                    .reduce(
                      (acc, item) =>
                        acc +
                        (item.product.product_item_price ?? 0) *
                          item.selectedSizeAndQty.qty,
                      0
                    )
                    .toLocaleString("en-PH")}
                </p>
                <Link href="/login" onClick={CloseModal}
                  className="cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-sm py-3 px-7">
                  Checkout
                </Link>
              </div>
            </>
          ) : (
            <p className="text-sm text-black dark:text-white h-50 flex items-center justify-center">
              Your cart is currently empty.
            </p>
          )}
        </div>
      </div>
    );
}