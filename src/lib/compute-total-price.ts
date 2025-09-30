import isCartItem from "./isCartItem";
import { SelectedItemProps } from "./store/cart-items";

export const ComputeTotalPriceWithQty = (cartItems: CartItemsProps[] | SelectedItemProps[]) => {
    return cartItems.reduce(
      (acc, item) => acc + (( isCartItem(item) ? item?.cart_item_price ?? 0 : item.product?.product_item_price ?? 0) *
      (isCartItem(item) ? item?.cart_item_qty ?? 0 : item?.selectedSizeAndQty?.qty)),
      0
    );
};
  