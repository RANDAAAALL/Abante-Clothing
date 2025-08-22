import { LinksPath } from "@/lib/paths/links-path";
import Link from "next/link";

export default function Links(){
    return (
        <div>
        <ul className="flex space-x-4">
            {LinksPath.map((link, i) => ( <Link key={i} href={`${link.pathTitle}`}/> ))}
        </ul>
        </div>
    );
}