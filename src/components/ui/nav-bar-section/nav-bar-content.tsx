"use client"
import NavbarActionsContainer from "./nav-bar-actions";
import NavbarLinks from "./nav-bar-links";
import NavbarLogo from "./nav-bar-logo";
import MenuBar from "./nav-bar-menu";
import { useEffect, useState } from "react";

export default function NavbarContent(){
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    useEffect(() => { document.body.style.overflow = `${isOpen ? "hidden" : "auto"}`; }, [isOpen]);

    return (
        <>
           <NavbarLogo />
           <MenuBar isOpen={isOpen} setIsOpen={setIsOpen}/>
           <div className={`${!isOpen ? "opacity-0" : isOpen} md:opacity-100 transition-opacity duration-300 ease-in-out w-full h-screen text-center bg-white-background dark:bg-black md:dark:bg-transparent gap-4 md:bg-transparent absolute top-0 left-0 z-1000 translate-x-0 translate-y-0 flex flex-col justify-center items-center md:flex md:flex-row md:space-y-0 md:gap-20 md:static md:block md:w-auto md:h-auto`}>
           <NavbarLinks />
           <NavbarActionsContainer /> 
           </div>
        </>
    );
}