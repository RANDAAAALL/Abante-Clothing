"use client"

import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useRouter } from "next/navigation";

export default function LogoutButton(){
    const { setIsOpen } = useMenuBarStore();
    const router = useRouter();
    const handleLogoutClick = async () => {
        await fetch(`/api/logout`, { method: "POST"});

        // listen for logout event in other tabs
        const bc = new BroadcastChannel("auth");
        bc.postMessage({ type: "LOGOUT" });
        bc.close();    

        router.push("/login");
        router.refresh();
        setIsOpen(false);
    }
    return (
        <button 
            onClick={handleLogoutClick}
            className="cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-lg py-3 px-4">
            Logout
        </button>
    );
}