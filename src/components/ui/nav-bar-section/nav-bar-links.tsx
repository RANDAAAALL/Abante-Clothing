import { LinksPath } from "@/lib/paths/links-path";
import Link from "next/link";

export default function NavbarLinks(){
    return (
        // flex space-x-4 ml-45"
        <div className="flex flex-col space-y-6 md:space-y-0 md:space-x-6 md:flex md:flex-row">
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