"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { UploadProfilePictureURL } from "@/lib/config";

export default function SidebarUserImage({
  user_image,
}: {
  user_image?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(user_image);
  // console.log("Image: ", image);
  const router = useRouter();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const file = e.target.files?.[0];
    if (!file) {
      // console.log("No file provided!");
      toast.error("No file provided!");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    // console.log("FormData: ", formData)
    // console.log("Uploaded Image: ", URL.createObjectURL(file));

    toast
      .promise(
        (async () => {
          const res = await fetchWithCsrf(`${UploadProfilePictureURL}`, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.errorMessage);

          return data;
        })(),
        {
          loading: "Uploading.....",
          success: (message) => {
            router.refresh();
            setImage(URL.createObjectURL(file));
            return message?.successMessage;
          },
          error: (e) => e?.message || "Something went wrong during upload",
        }
      )
      .finally(() => setIsUploading(false));
  };

  return (
    <div className={`relative group w-[110px] h-[110px] rounded-full`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        ref={fileInputRef}
        disabled={isUploading}
        className="hidden"
      />

      <Image
        key={image}
        src={image ?? "/images/png/default_avatar.png"}
        fill
        alt="user-profile-avatar"
        className={`rounded-full object-cover ${
          isUploading ? "cursor-not-allowed opacity-60" : ""
        }`}
      />

      <div
        onClick={() => {
          if (!isUploading) fileInputRef.current?.click();
        }}
        className={`
          absolute inset-0 rounded-full bg-black/60 flex items-center justify-center 
          text-white text-sm font-medium transition-opacity duration-300

          ${
            isUploading
              ? "opacity-0 cursor-not-allowed pointer-events-none"
              : "opacity-0 group-hover:opacity-100 cursor-pointer"
          }
        `}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </div>
    </div>
  );
}
