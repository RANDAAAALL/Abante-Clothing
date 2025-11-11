"use client";
import { usePathname } from "next/navigation";
import { memo } from "react";

function UserProfilePathTitleComponent() {
  const pathName = usePathname();
  const pathSegments = pathName.split("/").filter(Boolean);

  return (
    <>
      <span className="text-3xl font-bold">My Account</span>
      <div className="font-medium flex flex-wrap items-center space-x-1">
        <span>Home</span>
        {pathSegments.map((segment, index) => (
          <div key={index} className="flex items-center space-x-1">
            <span className="font-bold">&gt;</span>
            <span className="capitalize">{segment.replace(/-/g, " ")}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const UserProfilePathTitle = memo(UserProfilePathTitleComponent);
export default UserProfilePathTitle;
