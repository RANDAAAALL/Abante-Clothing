"use client"
import useMe from "@/hooks/useMe";

export default function UserProfileContent(){
    const { data } = useMe();
    return (
        <div className="flex flex-col">
        <span>{data?.user_ID}</span>
        <span>{data?.username}</span>
        <span>{data?.email}</span>
      </div>
    );
}