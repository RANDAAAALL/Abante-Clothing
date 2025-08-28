import Image from "next/image";

export default function NavbarThemeToggle() {
    return (
        <Image 
        src="/icons/svg/dark-mode.svg"
        height={25} width={25}
        alt="dark-mode-icon"/>
    );
}