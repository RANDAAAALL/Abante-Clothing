import FooterSectionContent from "../footer-section/footer-content";
import NavbarContent from "../nav-bar-section/nav-bar-content";


export function AboutContent(){
    return (
        <>
          {/* nav-bar section */}
          <header className="w-full font-regular gap-10 flex p-4 max-w-screen-xl md:justify-evenly md:items-center md:mx-auto"><NavbarContent /></header>

          {/* main section */}
          <main className="flex items-center justify-center text-center w-full min-h-screen md:max-w-3xl md:mx-auto p-4 md:p-6">
            <div>
            <p className="font-bold text-3xl">Who we are?</p>
            <p className="mt-3 font-medium text-justify text-sm">Abante Clothing is a growing clothing brand that specializes in oversized T-shirts,
            a popular fashion trend. Established in 2022 and based in Davao City, the business
            was founded with the goal of inspiring people and spreading positivity through fashion.
            It has successfully built a loyal customer base and gained industry knowledge while offering local delivery services.
            Looking ahead, Abante Clothing aims to expand its reach, open new branches, and extend its delivery services nationwide,
            all while staying true to its mission of creating meaningful apparel.</p>
            </div>
          </main>

          {/* footer section */}
          <footer className="font-regular text-sm w-full"><FooterSectionContent styleName="pb-3 md:py-6"/></footer>
        </>
    );
}