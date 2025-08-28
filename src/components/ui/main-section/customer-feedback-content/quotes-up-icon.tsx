"use client"

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function QuotesUpIcon() {
  const { theme } = useTheme();
  const mounted = useMounted();
  
  if (!mounted) return null;

  return (
      <Image
        className="absolute top-55 left-5"
        src={theme === "light" ? "/icons/svg/double-quotes-up-black.svg" : "/icons/svg/double-quotes-up-white.svg"}
        height={15}
        width={15}
        alt="quotes up icon"
      />
  );
}
