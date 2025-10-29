"use client"
import AbanteClothingLogo from "@/components/icons/svg/abante-clothing-logo";
import LogoutButton from "@/components/ui/user-profile-content/logout-button";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useState, useEffect, memo } from "react";
import NavbarButtons from "./navbar-buttons";
import NavbarCart from "./navbar-cart";
import NavbarLinks from "./navbar-links";
import MenuBar from "./navbar-menu";
import NavbarThemeToggle from "./navbar-theme-toggle";
import UserProfileNavigator from "@/components/ui/user-profile-content/user-profile-navigator";
import { useAuth } from "@/lib/store/auth";

function NavbarContentComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen } = useMenuBarStore();
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

  // to prevent background scroll when menu is open
  useEffect(() => { 
    document.body.style.overflow = isOpen ? "hidden" : "auto"; 
  }, [isOpen]);
  
  return (
    <header className={`${isScrolled ? "rounded-lg bg-white-background/20 dark:bg-black-background/20 backdrop-blur-md shadow-md" : ""} 
    w-full font-medium flex items-center max-w-5xl mx-auto p-4`}>
    
      {/* Logo always visible */}
      <AbanteClothingLogo flag={true} />

      {/* Desktop links */}
      <div className="hidden md:flex flex-1 justify-center md:ml-30">
        {isAuthenticated?.successMessage?.match(/!!/) ? null : <NavbarLinks style="space-x-6" />}
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center space-x-3">
        {isLoading ? <p>Loading...</p> : (
          <>
            {isAuthenticated?.successMessage?.match(/!!/) ? null : <NavbarCart flag={false} />}
            <NavbarThemeToggle />
            {isAuthenticated ? (
              <>
                {isAuthenticated?.successMessage?.match(/!!/) ? null : <UserProfileNavigator />}
                <LogoutButton 
                user_type={isAuthenticated?.successMessage?.match(/!!/) ? "admin" : "user"}
                href_type={isAuthenticated?.successMessage?.match(/!!/) ? "/admin/login" : "/login"}
                />
              </>
            ) : (
              <NavbarButtons style="flex space-x-2" />
            )}    
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden flex ml-auto space-x-3.5 mr-4.5">
        {isLoading ? <p>Loading...</p> : (
          <>
            {isAuthenticated?.successMessage?.match(/!!/) ? null : <NavbarCart flag={false} />}
            <NavbarThemeToggle />
            {isAuthenticated && (
              <>
                {isAuthenticated?.successMessage?.match(/!!/) ? null : <UserProfileNavigator />}
              </>
            )}
            <MenuBar />
          </>
        )}
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex flex-col items-center h-screen justify-center gap-2 bg-white-background dark:bg-black-background">
          {isAuthenticated?.successMessage?.match(/!!/) ? null : <NavbarLinks style="flex flex-col text-center space-y-2" />}
          {isAuthenticated ? (
             <LogoutButton 
             user_type={isAuthenticated?.successMessage?.match(/!!/) ? "admin" : "user"}
             href_type={isAuthenticated?.successMessage?.match(/!!/) ? "/admin/login" : "login"}
             />
          ) : (
            <NavbarButtons style="flex flex-col text-center space-y-2" />
          )}   
        </div>
      )}
    </header>
  );
};

const NavbarContent = memo(NavbarContentComponent);
export default NavbarContent;
