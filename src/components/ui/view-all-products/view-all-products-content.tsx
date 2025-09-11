import FooterSectionContent from "../footer-section/footer-content";
import NavbarContent from "../nav-bar-section/nav-bar-content";
import ViewAllProductsPathTitle from "./view-all-products-path-title";


export default function ViewAllProductsContent(){
    return (
     <div className="transition duration-500 ease-in-out bg-white-card-background dark:bg-black-background dark:text-white text-black min-h-screen w-full max-w-[1980] mx-auto"> 

        {/* nav-bar section */}
        <section className="z-50 sticky top-0"><NavbarContent /></section>

        {/* main section */}
        <main className="mt-10 w-full md:max-w-3xl mx-auto min-h-screen p-4 sm:p-0">

            {/* title  */}
            <ViewAllProductsPathTitle />
            

            <section className=""></section>


        </main>

        {/* footer section */}
        <footer className="text-sm w-full p-4"><FooterSectionContent className="" styleName="md:pt-6" /></footer>

     </div>
    );
}