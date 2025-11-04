import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma/prisma";
import { uploadProductSchema } from "@/lib/validations/upload-product-schema";
import { revalidateTag } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ product_item_ID: string }> }
) {
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");
  if (!verifyCsrfToken(request))
    return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 });

  try {
    const product_item_ID = (await params).product_item_ID;
    const formData = await request.formData();

    // get files
    const frontFile = formData.get("product_item_image") as File | string | null;
    const backFile = formData.get("product_item_back_image") as File | string | null;

    // get all other fields
    const rawFields = {
      product_item_name: formData.get("product_item_name")?.toString() || "",
      product_item_price: formData.get("product_item_price")?.toString() || "",
      product_item_discount: formData.get("product_item_discount")?.toString() || "",
      product_item_color: formData.get("product_item_color")?.toString() || "",
      product_item_size: formData.get("product_item_size")?.toString() || "",
      product_item_type: formData.get("product_item_type")?.toString() || "",
      product_item_fit: formData.get("product_item_fit")?.toString() || "",
      product_item_material: formData.get("product_item_material")?.toString() || "",
      product_item_construction: formData.get("product_item_construction")?.toString() || "",
      product_item_design_features: formData.get("product_item_design_features")?.toString() || "",
      product_item_stock: formData.get("product_item_stock")?.toString() || "",
      product_item_status: formData.get("product_item_status")?.toString() || "",
    };

    // fetch current product to preserve old images if not re-uploaded
    const existingProduct = await prisma.product_items.findUnique({
      where: { product_item_ID: Number(product_item_ID) },
    });

    if (!existingProduct) return NextResponse.json({ errorMessage: "Product not found. Failed to update" }, { status: 404 });

    // conditional uploads
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

    let frontImageUrl = existingProduct.product_item_image;
    let backImageUrl = existingProduct.product_item_back_image;

    // only upload if File, not a string
    if (frontFile instanceof File) {
      const frontRes = await uploadToCloudinary(frontFile);
      frontImageUrl = frontRes.secure_url;
    }

    if (backFile instanceof File) {
      const backRes = await uploadToCloudinary(backFile);
      backImageUrl = backRes.secure_url;
    }

    // validate with zod
    const parsedResult = uploadProductSchema.safeParse({
      ...rawFields,
      product_item_image: frontFile instanceof File ? frontFile : frontImageUrl,
      product_item_back_image: backFile instanceof File ? backFile : backImageUrl,
    });

    if (!parsedResult.success) {
      const firstError = parsedResult.error.issues[0];
      return NextResponse.json(
        { errorMessage: `${firstError.path.join(".")}: ${firstError.message}` },
        { status: 400 }
      );
    }

    const uploadFields = parsedResult.data;

    // update product in DB
    await prisma.product_items.update({
      where: { product_item_ID: Number(product_item_ID) },
      data: {
        product_item_name: uploadFields.product_item_name,
        product_item_price: parseFloat(uploadFields.product_item_price),
        product_item_discount: uploadFields.product_item_discount
          ? parseFloat(uploadFields.product_item_discount)
          : 0,
        product_item_image: frontImageUrl,
        product_item_back_image: backImageUrl,
        product_item_color: uploadFields.product_item_color,
        product_item_size: uploadFields.product_item_size,
        product_item_type: uploadFields.product_item_type,
        product_item_fit: uploadFields.product_item_fit,
        product_item_material: uploadFields.product_item_material,
        product_item_construction: uploadFields.product_item_construction,
        product_item_design_features: uploadFields.product_item_design_features,
        product_item_stock: parseInt(uploadFields.product_item_stock),
        product_item_status: uploadFields.product_item_status,
      },
    });

    // revalidate cache
    revalidateTag("all-status-products");

    return NextResponse.json({ successMessage: "Product updated successfully" });
  } catch (err) {
    return NextResponse.json(
      { errorMessage: err instanceof Error ? err.message : "Failed to update product." },
      { status: 500 }
    );
  }
}
