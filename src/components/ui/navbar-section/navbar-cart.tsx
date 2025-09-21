"use client";

import { useMounted } from "@/hooks/useMounted";
import { useCartItems } from "@/lib/store/cart-items";
import { useTheme } from "next-themes"; 
import Image from "next/image";

// flag - true means: icon itself isn't clickable inside the cart modal
// flag - false means: icon is clickable in the navbar
export default function NavbarCart({flag}: {flag: boolean}) {
  const { theme } = useTheme(); 
  const mounted = useMounted();
  const { selectedItem, OpenModal } = useCartItems();
  // console.log(OpenModal);

  if (!mounted) return null;

  const iconPath =
    theme === "light" ? "/icons/svg/grocery-store-black.svg" : "/icons/svg/grocery-store-white.svg";

  return (
    <div className="relative flex items-center">
      {selectedItem.length >= 1 && !flag && (
        <span className="absolute -top-2 -right-1.5 z-100 bg-red-600 text-white text-[13px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
        {selectedItem.length}
        </span>
      )}
      {!flag ? (
        <button className="relative w-[25] h-[25] cursor-pointer" onClick={OpenModal}>
            <Image
            suppressHydrationWarning
            src={iconPath}
            style={{ objectFit: 'contain'}}
            sizes="auto"
            fill
            priority={true}
            alt="grocery-store-icon"/>  
        </button>
      ): (
        <div className="relative w-[22] h-[22]"> 
        <Image
          suppressHydrationWarning
          src={iconPath}
          style={{ objectFit: 'contain'}}
          sizes="auto"
          fill
          priority={true}
          alt="grocery-store-icon"/>  
          </div>
        )}
    </div>
  );
}
