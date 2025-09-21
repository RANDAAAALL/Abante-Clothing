"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function PreviousButtonIcon() {
  const { theme } = useTheme();
  const mounted = useMounted();
  
  if (!mounted) return null;

  return (
    <div className="relative w-[15px] h-[15px]"> 
    <Image
      src={theme === "light"
        ? "/icons/svg/left-arrow-black.svg"
        : "/icons/svg/left-arrow-white.svg"}
      alt="previous button icon"
      fill
      style={{ objectFit: 'contain' }}
    />
  </div>
  
  );
}
