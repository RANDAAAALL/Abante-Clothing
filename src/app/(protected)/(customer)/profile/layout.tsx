// import SidebarContent from "@/components/ui/user-profile/left-sidebar/sidebar-content";
import SidebarContent from "@/components/ui/user-profile-content/left-sidebar/sidebar-content";

export const experimental_ppr = true;

export default function ProfileLayout({ children }: { children: React.ReactNode}){
    return (
    <div className="relative bg-white-card-background dark:bg-black-background dark:text-white text-black w-full max-w-[1980px] mx-auto h-auto md:h-screen">
        <div className="grid grid-cols-1 [@media(min-width:875px)]:grid-cols-2 [@media(min-width:875px)]:grid-cols-[270px_1fr] [@media(min-width:875px)]:gap-10 mt-10 w-full [@media(min-width:875px)]:max-w-4xl mx-auto p-4">
        {/* sidebar */}
        <aside><SidebarContent /></aside>

        {/* right content */}
        <main className="mt-6 [@media(min-width:875px)]:mt-16.5">{children}</main>
        </div>
    </div>
    );
}