import { ButtonsPath } from "@/lib/paths/buttons-path";
import Link from "next/link";

export default function NavbarButtons(){
    return (
        <>
        {ButtonsPath.map((btn, i) => (
            <Link key={i} href={btn.path} title={btn.name} className="font-metrapolis font-medium text-sl">{btn.name}</Link>
        ))}
        </>
    );
}