"use client"
import NavbarCart from "./navbar-cart";
import NavbarLinks from "./navbar-links";
import NavbarLogo from "./navbar-logo";
import MenuBar from "./navbar-menu";
import { useEffect, useState } from "react";
import NavbarThemeToggle from "./navbar-theme-toggle";
import NavbarButtons from "./navbar-buttons";

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
        w-full font-medium flex  items-center max-w-5xl mx-auto p-4`}>

      {/* Logo always visible */}
      <NavbarLogo flag={true} />

      {/* Desktop links */}
      <div className="hidden md:flex flex-1 justify-center md:ml-30"><NavbarLinks style={"space-x-6"} /> </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center space-x-3">
        <NavbarCart flag={false}/>
        <NavbarThemeToggle />
        <NavbarButtons style={"space-x-1"} />
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden ml-auto flex items-center space-x-3 mr-4.5">
        <NavbarCart flag={false}/>
        <NavbarThemeToggle />
        <MenuBar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center h-screen justify-center gap-2 bg-white-background dark:bg-black-background">
          <NavbarLinks style={"flex flex-col text-center space-y-2"} />
          <NavbarButtons style={"flex flex-col text-center space-y-2"} />
        </div>
      )}
    </header>
  );
}
