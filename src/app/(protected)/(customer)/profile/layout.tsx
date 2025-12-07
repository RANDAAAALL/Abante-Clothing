// import SidebarContent from "@/components/ui/user-profile/left-sidebar/sidebar-content";
import SidebarContent from "@/components/ui/user-profile-content/left-sidebar/sidebar-content";

// export const experimental_ppr = true;

export default function ProfileLayout({ children }: { children: React.ReactNode}){
    return (
    <div className="relative bg-white-card-background dark:bg-black-background dark:text-white text-black w-full max-w-[1980px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] md:gap-8 mt-10 md:max-w-5xl mx-auto p-4">
        {/* sidebar */}
        <aside><SidebarContent /></aside>

        {/* right content */}
        <main className="mt-6 md:mt-16.5 overflow-x-auto">
        {children}
        </main>
        </div>
    </div>
    );
}