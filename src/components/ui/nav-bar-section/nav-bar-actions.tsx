import NavbarButtons from "./nav-bar-buttons";
import NavbarCart from "./nav-bar-cart";
import NavbarThemeToggle from "./nav-bar-theme-toggle";

export default function NavbarActionsContainer(){
    return (
        <>
            <div className="flex flex-col items-center space-y-6 mt-2 md:mt-0 md:space-x-4 md:flex md:flex-row md:space-y-0">
            <NavbarThemeToggle/>
            <NavbarCart/>
            <NavbarButtons />
            </div>
        </>
    );
}