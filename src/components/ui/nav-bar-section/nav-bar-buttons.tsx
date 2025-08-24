import { ButtonsPath } from "@/lib/paths/buttons-path";
import Link from "next/link";

export default function NavbarButtons(){
    return (
        // flex ml-4 space-x-4
        <div className="space-y-3 flex flex-col md:ml-2 md:space-y-0 md:space-x-3 md:flex md:flex-row md:items-center">
        {ButtonsPath.map((btn, i) => (
            <Link key={i} href={btn.path} title={btn.name}
            className={` ${btn.name === "Sign Up" ? "bg-black-background rounded-lg py-3 px-4 text-white" : null}`}>
            {btn.name}
            </Link>
        ))}
        </div>
    );
}