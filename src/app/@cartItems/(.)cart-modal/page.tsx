"use client"

import { useRouter } from "next/navigation";

export default function CartModal(){
    const router = useRouter();

    return (
        <>
        <div className="w-full mx-auto h-screen bg-card-white-background dark:bg-card-dark-background">
        <button className="text-black font-bold float-right p-2" onClick={() => router.back()} >X</button>
        <p>Still in development....</p>
        </div>
        </>
    );
}