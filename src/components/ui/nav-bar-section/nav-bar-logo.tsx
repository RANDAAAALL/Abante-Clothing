"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function NavbarLogo() {
  const { theme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
      <Image
        src={theme === "light" ? "/images/svg/abante-clothing-logo-black.svg" : "/images/svg/abante-clothing-logo-white.svg"}
        height={65}
        width={65}
        alt="abante clothing logo"
      />
  );
}
