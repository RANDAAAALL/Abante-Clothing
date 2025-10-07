import { getUserInfo } from "@/data-access-layer/get-user-info";
export default async function AccountDetailsServerData() {
  const data = await getUserInfo();
  return (
    <div className="space-y-5 font-medium flex flex-col">
      <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-x-3">
        <span>Email:</span>
        <span className="break-words text-end md:text-start">{data?.email}</span>
      </div>

      <div className="grid grid-cols-[1fr_minmax(0,1fr)] gap-x-3">
        <span>Username:</span>
        <span className="break-words text-end md:text-start">{data?.username}</span>
      </div>
    </div>
  );
}
