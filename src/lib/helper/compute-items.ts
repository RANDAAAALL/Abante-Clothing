import isCartItem from "./isCartItem";
import { SelectedItemProps } from "../store/cart-items";
import { CartItemsProps } from "../types/cart-items-types";

export const computeItems = (
  cartItems: (CartItemsProps | SelectedItemProps)[],
  shippingFee?: string
) => {
  const fee = Number(shippingFee) || 0;

  // subtotal of all items
  const subTotalPriceResult = cartItems.reduce((acc, item) => {
    const price = isCartItem(item)
      ? item?.cart_item_price ?? 0
      : item.product?.product_item_price ?? 0;
    const qty = isCartItem(item)
      ? item?.cart_item_qty ?? 0
      : item?.selectedSizeAndQty?.qty ?? 0;
    return acc + price * qty;
  }, 0);

  // total qty
  const overallQtyResult = cartItems.reduce((acc, item) => {
    const qty = isCartItem(item)
      ? item?.cart_item_qty ?? 0
      : item?.selectedSizeAndQty?.qty ?? 0;
    return acc + qty;
  }, 0);

  // total price with shipping
  const overallPriceResult = subTotalPriceResult + fee;

  return {
    subTotalPriceResult,
    overallQtyResult,
    overallPriceResult,
  };
};
