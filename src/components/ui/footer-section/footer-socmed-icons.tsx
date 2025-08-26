"use client"

import { SocmedIconsValue } from "@/lib/values-type/socmed-icons-value";
import Image from "next/image";

export default function FooterSocmedIcons(){

    return (
        <div className="flex flex-col items-center text-center w-full md:w-auto md:gap-0 md:items-end">
        <div className="flex space-x-3 pb-5 md:flex-none md:space-x-2 md:pb-2">
        {SocmedIconsValue.map((socmed, i) => (
            <Image
            className="cursor-pointer"
            key={i}
            src={socmed.src}
            alt={socmed.alt}
            width={25}
            height={25}/>
            ))}
        </div>

        <div className="w-full md:w-auto">
        <hr className="border-t-1 border-black md:hidden"/>
        <p className="p-4 md:text-right md:p-0 md:mt-2">
        Abante Clothing. Trasing <br className="hidden md:block"/> Roxas Boulevard, <br className="md:hidden"/> Davao <br className="hidden md:block"/>City, Philippines 8000
        </p>
        </div>
        </div>
    );
}