"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function SidebarUserImage({ user_image }:{user_image?: string;}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file provided!");
      return;
    }
    // display temporary uploaded pic right away
    const url = URL.createObjectURL(file);
    setTempImage(url);

      try{
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload-profile-picture", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if(!res.ok) console.log("Error While Uploading: ", data?.errorMessage);
          console.log("Message: ", data?.sucessMessage)
          
      }catch(err){
        console.log("Error upload: ", err);
      }
    };

  return (
    <div className="relative group w-[110px] h-[110px]">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={fileInputRef}
        className="hidden"/>

      <Image
        src={ tempImage || user_image || "/images/png/default_avatar.png"}
        fill
        alt="user-profile-avatar"
        className="rounded-full object-cover"
      />
      <div onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 rounded-full bg-black/60 opacity-0
        group-hover:opacity-100 flex items-center justify-center 
        text-white text-sm font-medium transition-opacity duration-300 cursor-pointer">
        Edit
      </div>
    </div>
  );
}
