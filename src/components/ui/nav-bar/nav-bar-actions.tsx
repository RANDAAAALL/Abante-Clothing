import NavbarButtons from "./nav-bar-buttons";
import NavbarCart from "./nav-bar-cart";
import NavbarThemeToggle from "./nav-bar-theme-toggle";

export default function NavbarActionsContainer(){
    return (
        <div className="flex gap-6 items-center">
            <NavbarThemeToggle/>
            <NavbarCart/>
            <NavbarButtons />
        </div>
    );
}