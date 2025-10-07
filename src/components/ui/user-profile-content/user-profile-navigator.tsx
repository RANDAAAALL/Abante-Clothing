"use client"

import { useRouter } from "next/navigation";
import UserRoundSVG from "../../icons/svg/user-round";

export default function UserProfileNavigator(){
    const router = useRouter();
    
    const handleUserProfileClick = async () => router.push("/profile");

    return (
        <><button onClick={handleUserProfileClick}><UserRoundSVG width={25} height={25}/></button></>
    );
}