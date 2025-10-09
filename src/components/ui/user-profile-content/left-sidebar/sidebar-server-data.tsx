import SidebarUserImage from "./sidebar-user-image";
import { getUserInfo } from "@/data-access-layer/get-user-info";

export default async function SidebarServerData() {
  const data = await getUserInfo();
  return (
    <div className="flex flex-col items-center">
      <div className="relative group w-[110px] h-[110px]">
       <SidebarUserImage user_image={data?.user_image ?? "/images/png/default_avatar.png"} />
      </div>
      {/* <span className="text-lg font-medium mt-3">{data?.username ?? "Anonymous"}</span> */}
    </div>
  );
}
