import { ButtonsPath } from "@/lib/paths/buttons-path";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import clsx from "clsx";
import Link from "next/link";;

export default function NavbarButtons({style}: {style: string}) {
    const { setIsOpen } = useMenuBarStore();

    return (
        <div className={clsx(style, "font-medium flex items-center")}> 
            {ButtonsPath.map((btn, i) => (
                <Link key={i} href={btn.path} onClick={() => setIsOpen(false)} title={btn.name}
                className={` ${btn.name === "Sign Up" ? "bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-lg py-3 px-4" : null}`}>
                {btn.name}
                </Link>
            ))}
        </div>
    );
}