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
import React from "react";
import NavbarSkeleton from "../skeletons/navbar-card";

function NavbarContentComponent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isOpen } = useMenuBarStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const userType = isAuthenticated?.successMessage?.match(/!!/) ? "admin" : "user";

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
    <React.Fragment>
      {isLoading ? <NavbarSkeleton userType={userType} /> : ( 
        <header className={`${isScrolled ? "rounded-lg bg-white-background/20 dark:bg-black-background/20 backdrop-blur-md shadow-md" : ""} 
          w-full font-medium flex items-center ${isAuthenticated?.successMessage?.match(/!!/) ? "" : "max-w-5xl"} mx-auto p-4`}> 
         
          {/* logo */}
          <AbanteClothingLogo flag={true} />
    
          {/* desktop links */}
          <div className="hidden md:flex flex-1 justify-center md:ml-30">
            {<NavbarLinks linksPath={
              userType === "admin" 
              ?
              [{path: "/admin/dashboard", name: "Sales"},
              {path: "/admin/dashboard/orders", name: "Orders"},
              {path: "/admin/dashboard/upload-product", name: "Upload Product"},
              ]
              : 
              [{path: "/", name: "Home"},
              {path: "/about", name: "About"},
              {path: "/all-products", name: "Products"}]} style="space-x-6" />}
          </div>
    
          {/* desktop actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated?.successMessage?.match(/!!/) ? null : <NavbarCart flag={false} />}
            <NavbarThemeToggle />
            {isAuthenticated ? (
              <>
                {isAuthenticated?.successMessage?.match(/!!/) ? <p>{"Admin"}</p> : <UserProfileNavigator />}
                <LogoutButton 
                user_type={isAuthenticated?.successMessage?.match(/!!/) ? "admin" : "user"}
                href_type={isAuthenticated?.successMessage?.match(/!!/) ? "/admin/login" : "/login"}
                />
              </>
            ) : (
              <NavbarButtons style="flex space-x-2" />
            )}
          </div>
    
          {/* mobile menu button */}
          <div className="md:hidden flex ml-auto space-x-3.5 mr-4.5">  
            {isAuthenticated?.successMessage?.match(/!!/) ? null : <NavbarCart flag={false} />}
            <NavbarThemeToggle />
            {isAuthenticated && (
              <>
                {isAuthenticated?.successMessage?.match(/!!/) ? <p>Admin</p> : <UserProfileNavigator />}
              </>
            )}
            <MenuBar />
          </div>
    
          {/* mobile overlay */}
          {isOpen && (
            <div className="fixed inset-0 z-100 flex flex-col items-center h-screen justify-center gap-2 bg-white-background dark:bg-black-background">
              {<NavbarLinks linksPath={
              userType === "admin" 
              ?
              [{path: "/admin/dashboard", name: "Sales"},
              {path: "/admin/dashboard/orders", name: "Orders"},
              {path: "/admin/dashboard/upload-product", name: "Upload Product"},
              ]
              : 
              [{path: "/", name: "Home"},
              {path: "/about", name: "About"},
              {path: "/all-products", name: "Products"}]} style="flex flex-col items-center space-y-1.5" />}
              {isAuthenticated ? (
                <LogoutButton 
                user_type={isAuthenticated?.successMessage?.match(/!!/) ? "admin" : "user"}
                href_type={isAuthenticated?.successMessage?.match(/!!/) ? "/admin/login" : "/login"}
                />
              ) : (
                <NavbarButtons style="flex flex-col text-center space-y-2" />
              )}   
            </div>
          )}
        </header>
      )}
    </React.Fragment>
  );
};

const NavbarContent = memo(NavbarContentComponent);
export default NavbarContent;
