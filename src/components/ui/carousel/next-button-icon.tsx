"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function NextButtonIcon() {
  const { theme } = useTheme();
  const mounted = useMounted();
  
  if (!mounted) return null;

  return (
      <Image
        src={theme === "light" ? "/icons/svg/right-arrow-black.svg" : "/icons/svg/right-arrow-white.svg"}
        height={20}
        width={20}
        alt="previous button icon"
      />
  );
}
