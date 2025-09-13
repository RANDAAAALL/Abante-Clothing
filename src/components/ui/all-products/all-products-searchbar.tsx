"use client"

import { FormEvent } from "react";
import ViewAllProductsSearchbarIcon from "./all-products-search-icon";
import { usePathname,useRouter, useSearchParams } from "next/navigation";


export default function ViewAllProductsSearchbar(){
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q")?.toString() || "";

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchValue = formData.get("search") as string;

        const params = new URLSearchParams();
        if(searchValue) params.set("q", searchValue);
        else params.delete("q");

        router.replace(`${pathName}?${params.toString()}`);
    }
    console.log("Search Rendered!");

    return (
        <>
        <form onSubmit={handleSearch} className="rounded-sm">

        {/* container */}
        <div className="flex gap-1.5 items-center">

        {/* searchbar icon */}
        <ViewAllProductsSearchbarIcon />

        {/* searchbar field */}
        <input className="rounded-sm outline-none text-black dark:text-white w-full font-medium text-sm py-1"
        name="search"
        defaultValue={initialQuery}
        title="searchbar-input"/>
        </div>

        <hr className="w-full border border-t-2 border-black dark:border-white rounded-xl"/>
        </form>
        </>
    );
}