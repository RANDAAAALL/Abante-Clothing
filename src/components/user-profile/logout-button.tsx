"use client"

export default function LogoutButton(){
    const handleLogoutClick = async () => {
        await fetch(`/api/logout`, { method: "POST"});
        window.location.href = "/login";
    }
    return (
        <button 
            onClick={handleLogoutClick}
            className="cursor-pointer bg-card-black-background text-white dark:bg-card-white-background dark:text-black rounded-lg py-3 px-4">
            Logout
        </button>
    );
}