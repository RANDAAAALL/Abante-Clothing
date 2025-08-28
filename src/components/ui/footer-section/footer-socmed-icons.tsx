"use client"

import { useMounted } from "@/hooks/useMounted";
import { SocmedIconsValue } from "@/lib/values-type/socmed-icons-value";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function FooterSocmedIcons(){
    const { theme } = useTheme();
    const mounted = useMounted();
    
    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center text-center w-full md:w-auto md:gap-0 md:items-end">
        <div className="flex space-x-3 pb-5 md:flex-none md:space-x-2 md:pb-2">
        {SocmedIconsValue.map((socmed, i) => (
            <Link key={i} href={socmed.path} target="_blank">
                <Image
                className="cursor-pointer"
                src={`${theme === "light" ? socmed.srcBlack : socmed.srcWhite}`}
                alt={socmed.alt}
                width={25}
                height={25}/>
            </Link>          
            ))}
        </div>

        <div className="w-full md:w-auto">
        <hr className="dark:border-white border-t-1 border-black md:hidden"/>
        <p className="p-4 md:text-right md:p-0 md:mt-2">
        Abante Clothing. Trasing <br className="hidden md:block"/> Roxas Boulevard, <br className="md:hidden"/> Davao <br className="hidden md:block"/>City, Philippines 8000
        </p>
        </div>
        </div>
    );
}