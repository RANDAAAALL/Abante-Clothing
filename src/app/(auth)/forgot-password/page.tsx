import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import ForgotPasswordContent from "@/components/ui/form-content/forgot-password-form-content";
import NavbarContent from "@/components/ui/navbar-section/navbar-content";

export default function ForgotPassword(){
    return (
        <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
        
        {/* nav-bar section */}
        <section className="z-50 sticky top-0"><NavbarContent /></section>

        {/* main section */}
        <main className=" text-center w-full md:mx-auto p-4 md:p-0 md:px-6 ">
        <ForgotPasswordContent />
        </main>

        {/* footer section */}
        <footer className="text-sm w-full p-4"><FooterSectionContent styleName="md:pt-6" /></footer>
    </div>
    );
}