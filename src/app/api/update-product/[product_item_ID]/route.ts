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
    return NextResponse.json(
      { errorMessage: "Invalid CSRF Token" },
      { status: 403 }
    );

  try {
    const product_item_ID = (await params).product_item_ID;
    const formData = await request.formData();

    // get files
    const frontFile = formData.get("product_item_image") as
      | File
      | string
      | null;
    const backFile = formData.get("product_item_back_image") as
      | File
      | string
      | null;

    // get all other fields
    const rawFields = {
      product_item_name: formData.get("product_item_name")?.toString() || "",
      product_item_price: formData.get("product_item_price")?.toString() || "",
      product_item_discount:
        formData.get("product_item_discount")?.toString() || "",
      product_item_color: formData.get("product_item_color")?.toString() || "",
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

    // fetch current product
    const existingProduct = await prisma.product_items.findUnique({
      where: { product_item_ID: Number(product_item_ID) },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { errorMessage: "Product not found. Failed to update" },
        { status: 404 }
      );
    }

    // use existing images as default
    let frontImageUrl = existingProduct.product_item_image;
    let backImageUrl = existingProduct.product_item_back_image;

    // check if new files are provided
    const hasNewFrontFile = frontFile instanceof File;
    const hasNewBackFile = backFile instanceof File;

    // VALIDATION 1: zod schema with all validations including filename patterns
    const parsedResult = uploadProductSchema.safeParse({
      ...rawFields,
      product_item_image: hasNewFrontFile ? frontFile : frontImageUrl,
      product_item_back_image: hasNewBackFile ? backFile : backImageUrl,
    });

    if (!parsedResult.success) {
      const firstError = parsedResult.error.issues[0];
      return NextResponse.json(
        { errorMessage: `${firstError.path.join(".")}: ${firstError.message}` },
        { status: 400 }
      );
    }

    const uploadFields = parsedResult.data;

    // VALIDATION 2: check if product combination already exists in ANY product
    const existingProductWithSameDetails = await prisma.product_items.findFirst(
      {
        where: {
          AND: [
            { product_item_name: uploadFields.product_item_name },
            { product_item_color: uploadFields.product_item_color },
            { product_item_size: uploadFields.product_item_size },
            { product_item_type: uploadFields.product_item_type },
            // exclude the current product from the check
            { product_item_ID: { not: Number(product_item_ID) } },
          ],
        },
      }
    );

    if (existingProductWithSameDetails) {
      return NextResponse.json(
        {
          errorMessage:
            "Can't update because a product with the same name, color, size, and type already exists",
        },
        { status: 400 }
      );
    }

    // VALIDATION 3: check if there are actual changes from current product
    // for this check, we only compare with existing data since we haven't uploaded new images yet
    const hasChanges =
      uploadFields.product_item_name !== existingProduct.product_item_name ||
      parseFloat(uploadFields.product_item_price) !==
        parseFloat(String(existingProduct.product_item_price)) ||
      (uploadFields.product_item_discount
        ? parseFloat(uploadFields.product_item_discount)
        : 0) !== existingProduct.product_item_discount ||
      uploadFields.product_item_color !== existingProduct.product_item_color ||
      uploadFields.product_item_size !== existingProduct.product_item_size ||
      uploadFields.product_item_type !== existingProduct.product_item_type ||
      uploadFields.product_item_fit !== existingProduct.product_item_fit ||
      uploadFields.product_item_material !==
        existingProduct.product_item_material ||
      uploadFields.product_item_construction !==
        existingProduct.product_item_construction ||
      uploadFields.product_item_design_features !==
        existingProduct.product_item_design_features ||
      parseInt(uploadFields.product_item_stock) !==
        existingProduct.product_item_stock ||
      uploadFields.product_item_status !==
        existingProduct.product_item_status ||
      hasNewFrontFile || // if new front file is provided, there is a change
      hasNewBackFile; // if new back file is provided, there is a change

    if (!hasChanges) {
      return NextResponse.json(
        { errorMessage: "No changes detected - nothing to update" },
        { status: 400 }
      );
    }

    // ALL VALIDATIONS PASSED - now upload to Cloudinary and update database

    // upload to Cloudinary only if new files are provided
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

    // upload new images if provided
    if (hasNewFrontFile) {
      const frontRes = await uploadToCloudinary(frontFile as File);
      frontImageUrl = frontRes.secure_url;
    }

    if (hasNewBackFile) {
      const backRes = await uploadToCloudinary(backFile as File);
      backImageUrl = backRes.secure_url;
    }

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

    revalidateTag("all-status-products");
    revalidateTag("weekend-offers-products");
    revalidateTag("all-products");
    return NextResponse.json({
      successMessage: "Product updated successfully",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        errorMessage:
          err instanceof Error ? err.message : "Failed to update product.",
      },
      { status: 500 }
    );
  }
}
