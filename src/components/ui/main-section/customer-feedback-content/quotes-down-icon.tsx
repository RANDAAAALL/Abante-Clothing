"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function QuotesDownIcon() {
  const { theme } = useTheme();
  const mounted = useMounted();
  
  if (!mounted) return null;

  return (
      <Image
        className="absolute bottom-20 right-5"
        src={theme === "light" ? "/icons/svg/double-quotes-down-black.svg" : "/icons/svg/double-quotes-down-white.svg"}
        height={15}
        width={15}
        alt="quotes down icon"
      />
  );
}
