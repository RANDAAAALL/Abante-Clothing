"use client"

import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import FormsContent from "@/components/ui/form-content/form";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";
import { RegisterFormType } from "@/lib/types/form-data-types";
import { registerFields } from "@/lib/values-type/form-data-value";

export default function Register(){
    
    const handleRegister = (data: RegisterFormType) => {
        console.log(data);
    }

    return (
    <div className="transition duration-500 ease-in-out bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
        {/* nav-bar section */}
        <header className="w-full font-regular gap-10 flex p-4 max-w-screen-lg md:justify-evenly md:items-center md:mx-auto"><NavbarContent /></header>

        {/* main section */}
        {/* text-center w-full md:max-w-2xl md:mx-auto p-4 md:p-6 */}
        <main className=" text-center w-full md:mx-auto p-4 md:p-0 md:px-6 ">
        <FormsContent<RegisterFormType> fields={registerFields} onSubmit={handleRegister} />

        {/* footer section */}
        <footer className="font-regular text-sm w-full"><FooterSectionContent className="mt-15" styleName=" md:py-6"/></footer>
        </main>
    </div>
    );
}