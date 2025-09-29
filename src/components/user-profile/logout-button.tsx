"use client"
import { useMenuBarStore } from "@/lib/store/menu-bar";
import { useQueryClient } from "@tanstack/react-query";

export default function LogoutButton(){
    const { setIsOpen } = useMenuBarStore();
    const queryClient = useQueryClient();

    const handleLogoutClick = async () => {
        await fetch(`/api/logout`, { method: "POST"});

        // clear user data from react query cache of "api/me"
        queryClient.removeQueries({ queryKey: ["me"] });

        // clear user data from react query cache of "api/get-cart"
        queryClient.removeQueries({ queryKey: ["get-cart"] });

        // listen for logout event in other tabs
        const bc = new BroadcastChannel("auth");
        bc.postMessage({ type: "LOGOUT" });
        bc.close();    
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