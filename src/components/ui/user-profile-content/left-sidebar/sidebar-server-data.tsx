import SidebarUserImage from "./sidebar-user-image";
import { getUserInfo } from "@/dal/get-user-info";

export default async function SidebarServerData() {
  const data = awaiuploadProductFieldsTypet getUserInfo();
  return (
    <div className="flex flex-col items-center">
      <div className="relative group w-[110px] h-[110px]">
       <SidebarUserImage user_image={data?.user_image ?? "/images/png/default_avatar.png"} />
      </div>
      {/* <span className="text-lg font-medium mt-3">{data?.username ?? "Anonymous"}</span> */}
    </div>
  );
}
