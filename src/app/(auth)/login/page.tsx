import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import LoginFormContent from "@/components/ui/form-content/login-form-content";
import NavbarContent from "@/components/ui/navbar-section/navbar-content";

export default async function Login({searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) {
    const reason = (await searchParams).reason as string | undefined;

    if (reason === "expired") {
      console.log("Session expired. Please log in again.");
    } else if (reason === "invalid") {
      console.log("Invalid session. Please log in again.");
    }

    return (
        <div className="bg-white dark:bg-black-background dark:text-white text-black w-full max-w-[1980] mx-auto">
     
        {/* nav-bar section */}
        <section className="z-50 sticky top-0"><NavbarContent /></section>

        {/* main section */}
        <main className=" text-center w-full md:mx-auto p-4 md:p-0 md:px-6 ">
        <LoginFormContent />
        </main>

        {/* footer section */}
        <footer className="text-sm w-full p-4"><FooterSectionContent styleName="md:pt-6" /></footer>
    </div>
    );
}