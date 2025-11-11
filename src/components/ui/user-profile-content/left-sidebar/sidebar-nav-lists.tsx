"use client";
import UserRoundSVG from "@/components/icons/svg/user-round";
import HistorySVG from "@/components/icons/svg/history";
import BillingSVG from "@/components/icons/svg/billing";
import AddressSVG from "@/components/icons/svg/address";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

function SidebarNavListsComponent() {
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
        const handleClick = () => {
          if (!activePath) {
            router.push(p.path);
          }
        };

        return (
          <div
            key={i}
            onClick={handleClick}
            className={`rounded-md text-sm font-medium space-x-3 py-3 px-4 flex items-center ${
              activePath 
                ? "bg-slight-gray-background dark:bg-[#3B3B3B] cursor-default" 
                : "cursor-pointer hover:bg-slight-gray-background dark:hover:bg-[#3B3B3B]"
            }`}>
            <span>{p.icon}</span>
            <span>{p.title}</span>
          </div>
        );
      })}
    </>
  );
}

const SidebarNavLists = React.memo(SidebarNavListsComponent);
export default SidebarNavLists;