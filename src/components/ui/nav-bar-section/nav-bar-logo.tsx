"use client"

import { useMounted } from "@/hooks/useMounted";
import { NavbarLogoDimensionalType } from "@/lib/types/nav-bar-logo-types";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function NavbarLogo({LogoHeight, LogoWidth}: NavbarLogoDimensionalType ) {
  const { theme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
      <Image
        src={theme === "light" ? "/images/svg/abante-clothing-logo-black.svg" : "/images/svg/abante-clothing-logo-white.svg"}
        height={LogoHeight}
        width={LogoWidth}
        alt="abante clothing logo"
      />
  );
}
