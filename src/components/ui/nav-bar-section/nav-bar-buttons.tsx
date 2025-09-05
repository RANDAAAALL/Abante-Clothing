import { ButtonsPath } from "@/lib/paths/buttons-path";
import Link from "next/link";

export default function NavbarButtons(){
    return (
        // flex ml-4 space-x-4
        <div className="font-medium space-y-3 flex flex-col md:ml-1 md:space-y-0 md:space-x-2 md:flex md:flex-row md:items-center">
        {ButtonsPath.map((btn, i) => (
            <Link key={i} href={btn.path} title={btn.name}
            className={` ${btn.name === "Sign Up" ? "bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-lg py-3 px-4" : null}`}>
            {btn.name}
            </Link>
        ))}
        </div>
    );
}