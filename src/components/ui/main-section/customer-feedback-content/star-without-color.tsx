"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function StarColorWithoutColor() {
  const { theme } = useTheme();
  const mounted = useMounted();
  
  if (!mounted) return null;

  return (
       <>
      <Image
        className="w-4 h-4  "
        src={theme === "light" ? "/icons/svg/star-no-color-black.svg" : "/icons/svg/star-no-color-white.svg"}
        height={15}
        width={15}
        alt="star no color icon"
        />
        </>
  );
}
