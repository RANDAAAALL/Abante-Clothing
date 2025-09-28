"use client"
import AbanteClothingLogo from "@/components/icons/svg/abante-clothing-logo";
import LogoutButton from "@/components/user-profile/logout-button";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useState, useEffect } from "react";
import NavbarButtons from "./navbar-buttons";
import NavbarCart from "./navbar-cart";
import NavbarLinks from "./navbar-links";
import MenuBar from "./navbar-menu";
import NavbarThemeToggle from "./navbar-theme-toggle";
import useMe from "@/hooks/useMe";
import UserProfileNavigator from "@/components/user-profile/user-profile-navigator";

export default function NavbarContent() {
  const { data } = useMe();
  const { isOpen } = useMenuBarStore();
  const [isScrolled, setIsScrolled] = useState(false);

  // track scroll for styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
    
  // to prevent background scroll when menu is open
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : "auto"; }, [isOpen]);

  return (
    <header className={`${isScrolled ? "rounded-lg bg-white-background/20 dark:bg-black-background/20 backdrop-blur-md shadow-md" : ""} 
    w-full font-medium flex items-center max-w-5xl mx-auto p-4`}>
    
      {/* Logo always visible */}
      <AbanteClothingLogo flag={true} />

      {/* Desktop links */}
      <div className="hidden md:flex flex-1 justify-center md:ml-30">
        <NavbarLinks style="space-x-6" />
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center space-x-3">
        <NavbarCart flag={false} />
        <NavbarThemeToggle />
        {data ? (
          <>
            <UserProfileNavigator />
            <LogoutButton />
          </>
        ) : (
          <NavbarButtons style="flex space-x-2" />
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex ml-auto space-x-3.5 mr-4.5">
        <NavbarCart flag={false} />
        <NavbarThemeToggle />
        {data && <UserProfileNavigator />}
        <MenuBar />
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center h-screen justify-center gap-2 bg-white-background dark:bg-black-background">
          <NavbarLinks style="flex flex-col text-center space-y-2" />
          {data ? (
            <LogoutButton />
          ) : (
            <NavbarButtons style="flex flex-col text-center space-y-2" />
          )}
        </div>
      )}
    </header>
  );
}
