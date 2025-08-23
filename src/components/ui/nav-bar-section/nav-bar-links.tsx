import { LinksPath } from "@/lib/paths/links-path";
import Link from "next/link";

export default function NavbarLinks(){
    return (
        <div className="flex space-x-4 ml-45">
        {LinksPath.map((link, i) => (
            <Link
            key={i} href={`${link.path}`}
            title={link.name}
            className="font-metrapolis metrapolis font-medium text-sl">
            {link.name}
            </Link>))}
        </div>
    );
}