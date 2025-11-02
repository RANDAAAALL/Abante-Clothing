"use client";
import { useState, useEffect } from "react";
import { isAuthenticatedProps } from "@/lib/store/auth";

export default function NavbarSkeleton({
  isAuthenticated
}: { isAuthenticated: isAuthenticatedProps }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
  className={`${isScrolled
    ? "rounded-lg bg-white-background/20 dark:bg-black-background/20 backdrop-blur-md shadow-md"
    : ""
  } w-full font-medium`}>
  <div
    className={`flex items-center p-4 ${
      isAuthenticated?.successMessage?.match(/!!/) ? "max-w-full" : "max-w-5xl mx-auto"
    }`}>
      
    {/* === LOGO SKELETON === */}
    <div className="aspect-square h-11 rounded-full w-11 dashboard-orders-skeleton" />

    {/* === DESKTOP LINKS === */}
    <div className="hidden md:flex flex-1 justify-center md:ml-30 space-x-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 w-16 dashboard-orders-skeleton rounded-md" />
      ))}
    </div>

    {/* === DESKTOP ACTIONS === */}
    <div className="hidden md:flex items-center space-x-3">
      <div className="h-6 w-6 dashboard-orders-skeleton rounded-full" />
      <div className="h-6 w-6 dashboard-orders-skeleton rounded-full" />
      <div className="h-11 w-24 dashboard-orders-skeleton rounded-md" />
    </div>

    {/* === MOBILE ACTIONS === */}
    <div className="md:hidden flex ml-auto space-x-3.5 -mr-2">
      <div className="h-6 w-6 dashboard-orders-skeleton rounded-full" />
      <div className="h-6 w-6 dashboard-orders-skeleton rounded-full" />
      <div className="h-6 w-6 dashboard-orders-skeleton rounded-full" />
    </div>
  </div>
</header>

  );
}
