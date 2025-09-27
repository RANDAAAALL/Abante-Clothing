import { LinksPath } from "@/lib/paths/links-path";
import { useUserPayLoadStore } from "@/lib/store/user-payload";
import clsx from "clsx";
import Link from "next/link";

export default function NavbarLinks({ style }: { style: string}){

    return (
        <div className={clsx( style)}>
        {LinksPath.map((link, i ) => (
            <Link
            key={i} href={`${link.path}`}
            title={link.name}
            className="font-medium text-sl">
            {link.name}
            </Link>))}
        </div>
    );
}