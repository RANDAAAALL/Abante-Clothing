"use client";

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes"; 
import Image from "next/image";
import Link from "next/link";

export default function NavbarCart({flag, width, height}: {flag: boolean, width: number, height: number}) {
  const { theme } = useTheme(); 
  const mounted = useMounted();
  
  if (!mounted) return null;

  const iconPath =
    theme === "light" ? "/icons/svg/grocery-store-black.svg" : "/icons/svg/grocery-store-white.svg";

  return (
    <>
      {!flag ? (
      <Link href="/cart-modal">
        <Image
          suppressHydrationWarning
          src={iconPath}
          height={height}
          width={width}
          alt="grocery-store-icon"
        />  
      </Link>
      ): (
        <Image
        suppressHydrationWarning
        src={iconPath}
        height={height}
        width={width}
        alt="grocery-store-icon"
      />  
      )}
    </>
  );
}
