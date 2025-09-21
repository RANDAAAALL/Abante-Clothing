"use client"

import { useMounted } from "@/hooks/useMounted";
import { NavbarLogoDimensionalType } from "@/lib/types/nav-bar-logo-types";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function NavbarLogo({flag}: NavbarLogoDimensionalType ) {
  const { theme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
      <>
      {flag ? (
      <Link href="/">
     <div className="relative w-[60px] h-[60px]"> {/* container size */}
      <Image
        src={theme === "light"
          ? "/images/svg/abante-clothing-logo-black.svg"
          : "/images/svg/abante-clothing-logo-white.svg"}
        alt="abante clothing logo"
        fill
        style={{ objectFit: 'contain' }}
      />
    </div>
      </Link>
      ) : (
        <div className="relative w-[80px] h-[80px]"> {/* container size */}
        <Image
          src={theme === "light"
            ? "/images/svg/abante-clothing-logo-black.svg"
            : "/images/svg/abante-clothing-logo-white.svg"}
          alt="abante clothing logo"
          fill
          style={{ objectFit: 'contain' }}
        />
      </div>
      
      )}
      </>
  );
}
