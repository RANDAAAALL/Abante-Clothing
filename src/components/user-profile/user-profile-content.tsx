import UserProfileServerData from "./user-profile-server-data";
import { Suspense } from "react";

export default function UserProfileContent(){
    return (
        <div><Suspense fallback={"Loading....."}><UserProfileServerData /></Suspense></div>
    );
}