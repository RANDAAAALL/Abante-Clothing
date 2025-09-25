"use client";

import CartSVG from "@/components/icons/svg/cart";
import { useMounted } from "@/hooks/useMounted";
import { useCartItems } from "@/lib/store/cart-items";

// flag - true means: icon itself isn't clickable inside the cart modal
// flag - false means: icon is clickable in the navbar
export default function NavbarCart({flag}: {flag: boolean}) {
  const mounted = useMounted();
  const { selectedItem, OpenModal } = useCartItems();
  // console.log(OpenModal);

  if (!mounted) return null;
  return (
    <div className="relative flex items-center">
      {selectedItem.length >= 1 && !flag && (
        <span className="absolute -top-2 -right-1.5 z-100 bg-red-600 text-white text-[13px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
        {selectedItem.length}
        </span>
      )}
      
      {!flag ? <CartSVG className="relative w-[25] h-[25] cursor-pointer z-20" onClick={OpenModal} />
      : <CartSVG className="w-[22] h-[22]"/>}
    </div>
  );
}
