"use client";

import { useMounted } from "@/hooks/useMounted";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function NavbarThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <button
      className="cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle Theme"
    >
      <Image
        src={theme === "light" ? "/icons/svg/dark-mode.svg" : "/icons/svg/light-mode.svg"}
        height={25}
        width={25}
        alt={`${theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}`}
      />
    </button>
  );
}
