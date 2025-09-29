import { SelectedItemProps } from "./store/cart-items";

export default function isCartItem(item: CartItemsProps | SelectedItemProps): item is CartItemsProps {
    return "cart_item_name" in item;
  }
  