"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function NextButtonIcon() {
  const { theme } = useTheme();
  const mounted = useMounted();
  
  if (!mounted) return null;

  return (
    <div className="relative w-[15px] h-[15px]"> 
    <Image
      src={theme === "light"
        ? "/icons/svg/right-arrow-black.svg"
        : "/icons/svg/right-arrow-white.svg"}
      alt="next button icon"
      fill
      style={{ objectFit: 'contain' }}
    />
  </div>
  
  );
}
