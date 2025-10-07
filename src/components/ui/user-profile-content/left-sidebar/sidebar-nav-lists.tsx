"use client";
import UserRoundSVG from "@/components/icons/svg/user-round";
import HistorySVG from "@/components/icons/svg/history";
import BillingSVG from "@/components/icons/svg/billing";
import AddressSVG from "@/components/icons/svg/address";
import { usePathname, useRouter } from "next/navigation";

export default function SidebarNavLists() {
  const router = useRouter();
  const pathName = usePathname();

  const profilePaths = [
    { icon: <UserRoundSVG width={20} height={20} />, title: "Account Details", path: "/profile" },
    { icon: <HistorySVG width={20} height={20} />, title: "Order History", path: "/profile/order-history" },
    { icon: <BillingSVG width={20} height={20} />, title: "Billing", path: "/profile/billing" },
    { icon: <AddressSVG width={20} height={20} />, title: "Address", path: "/profile/address" },
  ];

  return (
    <>
      {profilePaths.map((p, i) => {
        const activePath = pathName === p.path;
        return (
          <div
            key={i}
            onClick={() => router.push(p.path)}
            className={`cursor-pointer rounded-md text-sm font-medium space-x-3 py-3 px-4 flex items-center hover:bg-slight-gray-background dark:hover:bg-[#3B3B3B] ${
              activePath ? "bg-slight-gray-background dark:bg-[#3B3B3B]" : ""
            }`}>
            <span>{p.icon}</span>
            <span>{p.title}</span>
          </div>
        );
      })}
    </>
  );
}
