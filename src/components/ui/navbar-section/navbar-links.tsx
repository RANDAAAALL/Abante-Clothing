import { NavbarLinksProps } from "@/lib/interface/navbar-links";
import { useMenuBarStore } from "@/lib/store/menu-bar";
import clsx from "clsx";
import Link from "next/link";

export default function NavbarLinks({ linksPath  ,style }: NavbarLinksProps){
    const { setIsOpen } = useMenuBarStore();
    return (
        <div className={clsx( style)}>
        {linksPath.map((link, i ) => (
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