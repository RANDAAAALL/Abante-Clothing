import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import LoginFormContent from "@/components/ui/form-content/login-form-content";
import NavbarContent from "@/components/ui/nav-bar-section/nav-bar-content";

export default function Login(){

    return (
        <div className="transition duration-500 ease-in-out bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
     
        {/* nav-bar section */}
        <header className="w-full font-regular gap-10 flex p-4 max-w-screen-lg md:justify-evenly md:items-center md:mx-auto"><NavbarContent /></header>

        {/* main section */}
        <main className=" text-center w-full md:mx-auto p-4 md:p-0 md:px-6 ">
        <LoginFormContent />

        {/* footer section */}
        <footer className="font-regular text-sm w-full"><FooterSectionContent className="mt-15" styleName=" md:py-6"/></footer>
     
        </main>
    </div>
    );
}