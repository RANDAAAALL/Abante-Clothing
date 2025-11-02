"use client";
import { useState, useEffect } from "react";

export default function NavbarSkeleton({
  userType
}: { userType: string }) {
  const [isScrolled, setIsScrolled] = useState(false);

  // track scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsScrolled]);
  
  return (
    <header className={`${isScrolled ? "rounded-lg bg-white-background/20 dark:bg-black-background/20 backdrop-blur-md shadow-md" : ""} 
    w-full font-medium flex items-center ${userType === "admin" ? "" : "max-w-5xl"} mx-auto p-4`}> 

      
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
  </header>

  );
}
