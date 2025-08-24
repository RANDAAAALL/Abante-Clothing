
import { MenuBarprops } from "@/lib/types/toggle-types";
import Image from "next/image";

export default function MenuBar({isOpen, setIsOpen}: MenuBarprops) {
    return (
        <>
        <Image 
        src={`${isOpen ? "/icons/svg/xmark-solid-full.svg" : "/icons/svg/bars-solid-full.svg"}`}
        height={30}
        width={30}
        alt="bars-solid-full" 
        className={`absolute z-10000 top-7 right-8 transition-opacity duration-500 ease-in-out md:hidden md:cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
        />
    </>
    );
}