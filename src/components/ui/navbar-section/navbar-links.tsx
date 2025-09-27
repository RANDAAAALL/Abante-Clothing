import { LinksPath } from "@/lib/paths/links-path";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import clsx from "clsx";
import Link from "next/link";

export default function NavbarLinks({ style }: { style: string}){
    const { setIsOpen } = useMenuBarStore();
    return (
        <div className={clsx( style)}>
        {LinksPath.map((link, i ) => (
            <Link
            key={i} href={`${link.path}`}
            onClick={() => setIsOpen(false)}
            title={link.name}
            className="font-medium text-sl">
            {link.name}
            </Link>))}
        </div>
    );
}