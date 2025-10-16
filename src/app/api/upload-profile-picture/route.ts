import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary"
import { isAuthenticatedUser } from "@/dal/verify-user";
import prisma from "@/lib/prisma/prisma";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  if (!await isAuthenticatedUser()) return NextResponse.redirect("/login");
  const data = await UserPayload();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ errorMessage: "No file provided" }, { status: 400 });
    
    // Convert File to Base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    const publicId = file.name.split(".")[0];

    const url = await cloudinary.uploader.upload(dataUri, {
      folder: `${process.env.UPLOAD_CUSTOMER_PROFILE_PIC}`, 
      public_id: publicId,
    });

    await prisma.users.update({
      where: { user_ID: Number(data?.user_ID)},
      data: {
        user_image: url.secure_url
      }
    });

    // revalidate the tag, to fecth fresh data on account-details
    revalidateTag("account-details");

    return NextResponse.json({ successMessage: "uploaded sucessfully"}, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ errorMessage: err }, { status: 500 });
  }
}
