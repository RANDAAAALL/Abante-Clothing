import NavbarActionsContainer from "./nav-bar-actions";
import NavbarLinks from "./nav-bar-links";
import NavbarLogo from "./nav-bar-logo";


export default function NavbarContent(){
    return (
        <>
           <NavbarLogo />
           <NavbarLinks />
           <NavbarActionsContainer />
        </>
    );
}