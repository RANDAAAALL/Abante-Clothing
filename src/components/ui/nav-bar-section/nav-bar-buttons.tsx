import { ButtonsPath } from "@/lib/paths/buttons-path";
import Link from "next/link";

export default function NavbarButtons(){
    return (
        <div className="ml-4 space-x-4">
        {ButtonsPath.map((btn, i) => (
            <Link key={i} href={btn.path} title={btn.name}
            className={` ${btn.name === "Sign Up" ? "bg-black-background rounded-lg py-3 px-4 text-white" : null}`}>
            {btn.name}
            </Link>
        ))}
        </div>
    );
}