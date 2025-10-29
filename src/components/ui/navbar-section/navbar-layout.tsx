import { ReactNode } from "react";
import NavbarContent from "./navbar-content";
import React from "react";

export default function NavbarLayout({ children }: { children: ReactNode }){

    return (
        <React.Fragment>
         <section className="z-50 sticky top-0"><NavbarContent/></section>
         {children}
        </React.Fragment>
    );
}