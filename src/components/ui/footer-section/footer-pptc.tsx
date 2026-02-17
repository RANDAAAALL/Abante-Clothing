import { FooterLinksPath } from "@/lib/paths/footer-links-path";
import Link from "next/link";
import clsx from "clsx";

export default function FooterPPC({className}: {className?: string}){
    return (
        <div className={clsx("font-medium text-center md:w-auto md:flex md:flex-row-reverse md:justify-between md:mx-20", className)}>
            <hr className="dark:border-white border-t-1 border-black md:hidden"/>
            <div className="flex items-center justify-evenly p-1 mt-2 md:mt-0 md:p-0 md:gap-6">
            {FooterLinksPath.map((link, i) => (
            <Link key={i} href={link.path}>{link.name}</Link>
            ))}
            </div>
            <p>{`@ ${new Date().getFullYear()} Abante Clothing. All rights reserved`}</p>
        </div>
    );
}