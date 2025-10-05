"use client"

import FacebookLogoSVG from "@/components/icons/svg/facebook-logo";
import InstagramLogoSVG from "@/components/icons/svg/instagram-logo";
import { useMounted } from "@/hooks/useMounted";
import Link from "next/link";

export default function FooterSocmedIcons(){
    const mounted = useMounted();
    
    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center text-center w-full md:w-auto md:gap-0 md:items-end">
        <div className="flex space-x-3 pb-5 md:flex-none md:space-x-2 md:pb-2">
        <Link href="https://www.facebook.com/Abante.geo" target="_blank"><FacebookLogoSVG className="w-[22px] h-[22px]"/></Link>
        <Link href="https://www.facebook.com/Abante.geo" target="_blank"><InstagramLogoSVG className="w-[22px] h-[22px]"/></Link>
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