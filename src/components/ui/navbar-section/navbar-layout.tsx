import { ReactNode } from "react";
import NavbarContent from "./navbar-content";
export default function NavbarLayout({ children }: { children: ReactNode }){

    return (
        <>
         <section className="z-50 sticky top-0"><NavbarContent/></section>
        {children}
        </>
    );
}