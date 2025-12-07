import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma/prisma";
import { uploadProductSchema } from "@/lib/validations/upload-product-schema";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
  if (!verifyCsrfToken(request))
    return NextResponse.json(
      { errorMessage: "Invalid CSRF Token" },
      { status: 403 }
    );

  try {
    const formData = await request.formData();

    // extract files
    const frontFile = formData.get("product_item_image") as File | null;
    const backFile = formData.get("product_item_back_image") as File | null;

    if (!frontFile || !backFile)
      return NextResponse.json(
        { errorMessage: "Both front and back images are required" },
        { status: 400 }
      );

    // extract fields
    const rawFields = {
      product_item_name:
        formData.get("product_item_name")?.toString().toLowerCase() || "",
      product_item_price: formData.get("product_item_price")?.toString() || "",
      product_item_discount:
        formData.get("product_item_discount")?.toString() || "",
      product_item_color:
        formData.get("product_item_color")?.toString().toLowerCase() || "",
      product_item_size: formData.get("product_item_size")?.toString() || "",
      product_item_type: formData.get("product_item_type")?.toString() || "",
      product_item_fit: formData.get("product_item_fit")?.toString() || "",
      product_item_material:
        formData.get("product_item_material")?.toString() || "",
      product_item_construction:
        formData.get("product_item_construction")?.toString() || "",
      product_item_design_features:
        formData.get("product_item_design_features")?.toString() || "",
      product_item_stock: formData.get("product_item_stock")?.toString() || "",
      product_item_status:
        formData.get("product_item_status")?.toString() || "",
    };

    // console.log("Upload Product -> Raw fields", rawFields);

    //  VALIDATION 1: Validate with Zod schema (including filename patterns)
    const parsedResult = uploadProductSchema.safeParse({
      ...rawFields,
      product_item_image: frontFile,
      product_item_back_image: backFile,
    });

    if (!parsedResult.success) {
      const firstError = parsedResult.error.issues[0];
      return NextResponse.json(
        { errorMessage: `${firstError.path.join(".")}: ${firstError.message}` },
        { status: 400 }
      );
    }

    const uploadFields = parsedResult.data;
    // console.log("Upload Product -> upload fields", uploadFields);

    //  VALIDATION 2: Check if product combination already exists in ANY product
    const existingProductWithSameDetails = await prisma.product_items.findFirst(
      {
        where: {
          AND: [
            { product_item_name: uploadFields.product_item_name },
            { product_item_color: uploadFields.product_item_color },
          ],
        },
      }
    );

    if (existingProductWithSameDetails) {
      return NextResponse.json(
        {
          errorMessage:
            "Can't create product because a product with the same name and color already exists",
        },
        { status: 400 }
      );
    }

    // ALL VALIDATIONS PASSED - Now upload to Cloudinary and create in database

    // upload images to Cloudinary
    const uploadToCloudinary = async (file: File) => {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const mimeType = file.type;
      const dataUri = `data:${mimeType};base64,${base64}`;
      const publicId = file.name.split(".")[0];

      return await cloudinary.uploader.upload(dataUri, {
        folder: process.env.UPLOAD_TSHIRT_IMAGE,
        public_id: publicId,
      });
    };

    const frontImageUpload = await uploadToCloudinary(frontFile);
    const backImageUpload = await uploadToCloudinary(backFile);

    // create product in database
    await prisma.product_items.create({
      data: {
        product_item_name: uploadFields.product_item_name,
        product_item_price: parseFloat(uploadFields.product_item_price),
        product_item_discount: uploadFields.product_item_discount
          ? parseFloat(uploadFields.product_item_discount)
          : 0,
        product_item_image: frontImageUpload.secure_url,
        product_item_back_image: backImageUpload.secure_url,
        product_item_color: uploadFields.product_item_color,
        product_item_size: uploadFields.product_item_size,
        product_item_type: uploadFields.product_item_type,
        product_item_fit: uploadFields.product_item_fit,
        product_item_material: uploadFields.product_item_material,
        product_item_construction: uploadFields.product_item_construction,
        product_item_design_features: uploadFields.product_item_design_features,
        product_item_stock: parseInt(uploadFields.product_item_stock),
        product_item_status: uploadFields.product_item_status,
        product_item_displayDate: new Date(),
      },
    });

    // Revalidate the tag to fetch fresh data and display new uploaded product
    revalidateTag("all-status-products", {});
    return NextResponse.json({
      successMessage: "Product uploaded successfully",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        errorMessage:
          err instanceof Error ? err.message : "Failed to upload product.",
      },
      { status: 500 }
    );
  }
}
