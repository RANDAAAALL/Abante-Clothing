"use client"
import { FormEvent, useMemo } from "react";
import ViewAllProductsSearchbarIcon from "../../icons/svg/search-bar";
import { usePathname,useRouter, useSearchParams } from "next/navigation";

export default function ViewAllProductsSearchbar(){
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const initialQuery = useMemo(() => {
        return searchParams.get("q")?.toString() || "";
    }, [searchParams]);

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const searchValue = formData.get("search") as string;

        const params = new URLSearchParams();
        if(searchValue) params.set("q", searchValue);
        else params.delete("q");

        router.replace(`${pathName}?${params.toString()}`);
    }

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
        title="searchbar-input"
        placeholder="Search by name, color or price..."/>
        </div>

        <hr className="w-full border border-t-2 border-black dark:border-white rounded-xl"/>
        </form>
        </>
    );
}