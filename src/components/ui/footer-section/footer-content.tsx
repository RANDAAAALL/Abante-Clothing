import clsx from "clsx";
import NavbarLogo from "../navbar-section/navbar-logo";
import FooterPPC from "./footer-pptc";
import FooterSocmedIcons from "./footer-socmed-icons";

export default function FooterSectionContent({styleName, className}: {className?: string ,styleName?: string}){
    return (
       <>
        {/* footer logo and socmed icons */}
        <hr className={clsx("dark:border-white border-t1 border-black pb-4 md:pb-0", className)}/>
        <div className="font-medium flex flex-col items-center gap-2 md:flex-row md:justify-between md:gap-0 sm:py-5 md:mx-20">
        <NavbarLogo flag={false}/>
        <FooterSocmedIcons />
        </div>

        {/* footer pptc */}
        <hr className="dark:border-white border-t-1 border-black hidden md:block"/>
        <FooterPPC className={styleName}/>
       </>
    );
}