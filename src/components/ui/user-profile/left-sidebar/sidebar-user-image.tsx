"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SidebarUserImage({ user_image }:{user_image?: string;}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ isUploading, setIsUploading ] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file provided!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    toast.promise(
      (async () => {
        setIsUploading(true);
        const res = await fetch("/api/upload-profile-picture", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if(!res.ok) throw new Error(data?.errorMessage || "Something went wrong during upload");
        router.refresh(); // to trigger the server revalidatePath
      })(), {
      loading: 'Uploading.....',
      success: 'Uploaded successfully',
      error: (e) => e?.message ||  'Upload failed'
    }).finally(() => setIsUploading(false));
    };

  return (
    <div className="relative group w-[110px] h-[110px]">
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={fileInputRef}
        disabled={isUploading}
        className="hidden"/>

      <Image
        key={user_image}
        src={ user_image ?? "/images/png/default_avatar.png"}
        fill
        alt="user-profile-avatar"
        className="rounded-full object-cover"/>
      <div onClick={() => fileInputRef.current?.click()}
        className="absolute inset-0 rounded-full bg-black/60 opacity-0
        group-hover:opacity-100 flex items-center justify-center 
        text-white text-sm font-medium transition-opacity duration-300 cursor-pointer">
        Upload
      </div>
    </div>
  );
}
