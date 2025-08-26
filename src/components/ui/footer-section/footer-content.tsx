import NavbarLogo from "../nav-bar-section/nav-bar-logo";
import FooterPPC from "./footer-pptc";
import FooterSocmedIcons from "./footer-socmed-icons";

export default function FooterSectionContent(){
    return (
       <>
        {/* footer logo and socmed icons */}
        <hr className="border-t1 border-black mt-30 pb-4 sm:pb-0"/>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between sm:gap-0 sm:py-5 sm:mx-20">
        <NavbarLogo />
        <FooterSocmedIcons />
        </div>

        {/* footer pptc */}
        <hr className="border-t-1 border-black hidden sm:block"/>
        <FooterPPC />
       </>
    );
}