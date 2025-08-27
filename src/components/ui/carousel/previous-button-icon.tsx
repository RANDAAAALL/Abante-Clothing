"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function PreviousButtonIcon() {
  const { theme } = useTheme();
  const mounted = useMounted();
  
  if (!mounted) return null;

  return (
      <Image
        src={theme === "light" ? "/icons/svg/left-arrow-black.svg" : "/icons/svg/left-arrow-white.svg"}
        height={20}
        width={20}
        alt="next button icon"
      />
  );
}
