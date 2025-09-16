"use client";

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes"; 
import Image from "next/image";
import Link from "next/link";

export default function NavbarCart() {
  const { theme } = useTheme(); 
  const mounted = useMounted();
  
  if (!mounted) return null;

  const iconPath =
    theme === "light" ? "/icons/svg/grocery-store-black.svg" : "/icons/svg/grocery-store-white.svg";

  return (
    <>
      <Link href="/cart-modal">
        <Image
          suppressHydrationWarning
          src={iconPath}
          height={25}
          width={25}
          alt="grocery-store-icon"
        />
      </Link>
    </>
  );
}
