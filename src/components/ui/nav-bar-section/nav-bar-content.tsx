"use client"
import NavbarCart from "./nav-bar-cart";
import NavbarLinks from "./nav-bar-links";
import NavbarLogo from "./nav-bar-logo";
import MenuBar from "./nav-bar-menu";
import { useEffect, useState } from "react";
import NavbarThemeToggle from "./nav-bar-theme-toggle";
import NavbarButtons from "./nav-bar-buttons";

export default function NavbarContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // track scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <header
      className={`${isScrolled ? "rounded-lg bg-white-background/20 dark:bg-black-background/20 backdrop-blur-md shadow-md" : ""} 
        w-full font-medium flex items-center max-w-5xl mx-auto p-4`}>

      {/* Logo always visible */}
      <NavbarLogo LogoHeight={65} LogoWidth={65} flag={true} />

      {/* Desktop links */}
      <div className="hidden md:flex flex-1 justify-center md:ml-30"><NavbarLinks style={"space-x-6"} /> </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center space-x-3">
        <NavbarCart />
        <NavbarThemeToggle />
        <NavbarButtons style={"space-x-2"} />
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden ml-auto flex items-center space-x-3 mr-4.5">
        <NavbarCart />
        <NavbarThemeToggle />
        <MenuBar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white-background dark:bg-black-background">
          <NavbarLinks style={"flex flex-col text-center space-y-3"} />
          <NavbarButtons style={"flex flex-col text-center space-y-3"} />
        </div>
      )}
    </header>
  );
}
