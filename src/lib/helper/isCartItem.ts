import { SelectedItemProps } from "../store/cart-items";
import { CartItemsProps } from "../types/cart-items-types";

export default function isCartItem(item: CartItemsProps | SelectedItemProps): item is CartItemsProps {
    return "cart_item_name" in item;
  }
  