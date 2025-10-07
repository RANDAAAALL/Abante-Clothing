import { Suspense } from "react";
import { Card, CardHeader, CardContent } from "../../carousel/card";
import UserProfilePathTitle from "./user-profile-path-title";
import SidebarNavLists from "./sidebar-nav-lists";
import SidebarServerData from "./sidebar-server-data";
import UserImageAndUsernameSkeleton from "../../skeletons/user-image-and-username";

export default function SidebarContent() {
  return (
    <>
    {/* profile path title */}
    <section className="mb-2"><UserProfilePathTitle /></section>

    {/* card content container */}
    <Card className="dark:bg-card-black-background h-auto md:h-120 rounded-md">
        
      {/* images and username */}
      <CardHeader className="flex flex-col items-center cursor-default">
        <Suspense fallback={<UserImageAndUsernameSkeleton/>}><SidebarServerData /></Suspense>
      </CardHeader> 

      {/* sidebar nav lists */}
      <CardContent className="space-y-1"><SidebarNavLists /></CardContent>
    </Card>
    </>
  );
}
