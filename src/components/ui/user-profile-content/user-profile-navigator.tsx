"use client"
import { useRouter } from "next/navigation";
import UserRoundSVG from "../../icons/svg/user-round";
import { useAuth } from "@/lib/store/auth";

export default function UserProfileNavigator(){
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    
    const handleUserProfileClick = () => {
        if (!isAuthenticated || isLoading) return;
        router.push("/profile");
    };
    return (
        <><button onClick={handleUserProfileClick}><UserRoundSVG width={25} height={25}/></button></>
    );
}