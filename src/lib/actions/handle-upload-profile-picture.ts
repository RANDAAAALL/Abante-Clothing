"use server";

import { updateTag } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { isAuthenticatedUser } from "@/dal/verify-user";
import prisma from "@/lib/prisma/prisma";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { redirect } from "next/navigation";

export async function actionUploadProfilePicture(file: File) {
  try {
    // check authentication
    if (!(await isAuthenticatedUser())) redirect("/login");

    // get user payload
    const data = await UserPayload();
    if (!data) redirect("/login");

    // validate file
    if (!file) {
      return {
        errorMessage: "No file provided",
        status: 400,
      };
    }

    // validate file type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5mb max size upload

    if (!allowedTypes.includes(file.type)) {
      return {
        errorMessage:
          "Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.",
        status: 400,
      };
    }

    if (file.size > maxSize) {
      return {
        success: false,
        errorMessage: "File size too large. Maximum size is 5MB.",
        status: 400,
      };
    }

    // convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    // generate unique public ID
    const publicId = file.name.split(".")[0];

    // upload to cloudinary
    const url = await cloudinary.uploader.upload(dataUri, {
      folder: `${process.env.UPLOAD_CUSTOMER_PROFILE_PIC}`,
      public_id: publicId,
    });

    // update user profile in database
    await prisma.users.update({
      where: { user_ID: Number(data?.user_ID) },
      data: {
        user_image: url.secure_url,
      },
    });

    // revalidate cache
    updateTag("account-details");

    return {
      successMessage: "Uploaded successfully.",
      status: 200,
    };
  } catch (error) {
    // console.error("Profile picture upload error:", error);

    // handle cloudinary errors
    let errorMessage = "Failed to upload profile picture";
    if (error instanceof Error) {
      if (error.message.includes("File size too large")) {
        errorMessage = "Image file is too large. Maximum size is 5MB.";
      } else if (error.message.includes("Invalid image file")) {
        errorMessage = "Invalid image file. Please upload a valid image.";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      errorMessage,
      status: 500,
    };
  }
}
