import { ButtonsPath } from "@/lib/paths/buttons-path";
import Link from "next/link";

export default function NavbarButtons(){
    return (
        <>
        {ButtonsPath.map((btn, i) => (
            <Link key={i} href={btn.path} title={btn.name}
            className={`${btn.name === "Sign Up" ? "bg-black-background rounded-lg p-2 text-white" : null}`}>
            {btn.name}
            </Link>
        ))}
        </>
    );
}