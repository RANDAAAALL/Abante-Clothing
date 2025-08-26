"use client"

import { SocmedIconsValue } from "@/lib/values-type/socmed-icons-value";
import Image from "next/image";

export default function FooterSocmedIcons(){

    return (
        <div className="flex flex-col items-center text-center w-full sm:w-auto sm:gap-0 sm:items-end">
        <div className="flex space-x-3 pb-5 sm:flex-none sm:space-x-2 sm:pb-2">
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

        <div className="w-full sm:w-auto">
        <hr className="border-t-1 border-black sm:hidden"/>
        <p className="p-4 sm:text-right sm:p-0 sm:mt-2">
        Abante Clothing. Trasing <br className="hidden sm:block"/> Roxas Boulevard, <br className="sm:hidden"/> Davao <br className="hidden sm:block"/>City, Philippines 8000
        </p>
        </div>
        </div>
    );
}