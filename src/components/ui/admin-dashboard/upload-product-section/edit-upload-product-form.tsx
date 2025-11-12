"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { UpdateProductURL } from "@/lib/config";
import { uploadProductFieldsType, uploadProductSchema } from "@/lib/validations/upload-product-schema";
import { StatusProductsProps } from "@/lib/types/status-products-types";
import { ImageUploadBox } from "./image-upload-box";
import { useRouter } from "next/navigation";

export default function EditUploadProductForm({
  product,
  closeDialog,
}: {
  product: StatusProductsProps;
  closeDialog: () => void;
}) {
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(product.product_item_image);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(product.product_item_back_image);
  const [hasNewFrontImage, setHasNewFrontImage] = useState(false);
  const [hasNewBackImage, setHasNewBackImage] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<uploadProductFieldsType>({
    resolver: zodResolver(uploadProductSchema),
    defaultValues: {
      product_item_image: product.product_item_image ?? "",
      product_item_back_image: product.product_item_back_image ?? "",
      product_item_name: product.product_item_name ?? "",
      product_item_price: product.product_item_price?.toString() ?? "",
      product_item_discount: product.product_item_discount?.toString() ?? "",
      product_item_color: product.product_item_color ?? "",
      product_item_size: product.product_item_size ?? "",
      product_item_type: product.product_item_type ?? "",
      product_item_fit: product.product_item_fit ?? "",
      product_item_material: product.product_item_material ?? "",
      product_item_construction: product.product_item_construction ?? "",
      product_item_design_features: product.product_item_design_features ?? "",
      product_item_stock: product.product_item_stock?.toString() ?? "",
      product_item_status: product.product_item_status as
      | "available"
      | "not available"
      | "to be deploy",
    },
  });

  const handleFileSelect = (file: File, type: "front" | "back") => {
    const url = URL.createObjectURL(file);
    const key = type === "front" ? "product_item_image" : "product_item_back_image";
    
    setValue(key, file);
    if (type === "front") {
      setFrontImagePreview(url);
      setHasNewFrontImage(true);
    } else {
      setBackImagePreview(url);
      setHasNewBackImage(true);
    }
  };

  const handleRemoveImage = (type: "front" | "back") => {
    const key = type === "front" ? "product_item_image" : "product_item_back_image";
    
    // Clear the form value - set to empty string
    setValue(key, "");
    
    if (type === "front") {
      setFrontImagePreview(null);
      setHasNewFrontImage(false);
    } else {
      setBackImagePreview(null);
      setHasNewBackImage(false);
    }
  };

  const onSubmit = async (uploadFields: uploadProductFieldsType) => {
    // Debug: check what we re submitting
    // console.log('submitting:', {
    //   frontImage: uploadFields.product_item_image,
    //   backImage: uploadFields.product_item_back_image,
    //   hasNewFrontImage,
    //   hasNewBackImage
    // });

    // Check if images are required but missing
    if ((!uploadFields.product_item_image || uploadFields.product_item_image === "") && 
        (!uploadFields.product_item_back_image || uploadFields.product_item_back_image === "")) {
      toast.error("Both front and back images are required");
      return;
    }

    if (!uploadFields.product_item_image || uploadFields.product_item_image === "") {
      toast.error("Front image is required");
      return;
    }

    if (!uploadFields.product_item_back_image || uploadFields.product_item_back_image === "") {
      toast.error("Back image is required");
      return;
    }

    // Create comparison data
    const currentData = {
      ...uploadFields,
      product_item_image: uploadFields.product_item_image,
      product_item_back_image: uploadFields.product_item_back_image,
    };

    // Create original data
    const originalData = {
      ...product,
      product_item_price: product.product_item_price?.toString() ?? "",
      product_item_discount: product.product_item_discount?.toString() ?? "",
      product_item_stock: product.product_item_stock?.toString() ?? "",
      product_item_image: product.product_item_image,
      product_item_back_image: product.product_item_back_image,
    };

    // Enhanced change detection
    const isChanged = Object.keys(currentData).some((key) => {
      const k = key as keyof typeof currentData;
      const currentValue = currentData[k];
      const originalValue = originalData[k];

      // Handle image fields
      if (k === 'product_item_image' || k === 'product_item_back_image') {
        // If current value is empty string but original has value, it's a change (removal)
        if (currentValue === "" && originalValue) return true;
        // If current value is a File (new upload), it's a change
        if (currentValue instanceof File) return true;
        // If current value is different string from original, it's a change
        if (typeof currentValue === 'string' && currentValue !== originalValue) return true;
        return false;
      }

      // Handle other fields
      return String(currentValue ?? "") !== String(originalValue ?? "");
    });

    if (!isChanged) {
      toast.error("No changes detected — nothing to update.");
      return;
    }

    // Continue to update if something changed
    const formData = new FormData();

    // Handle files - only append if they're File objects (new uploads)
    if (uploadFields.product_item_image instanceof File) {
      formData.append("product_item_image", uploadFields.product_item_image);
    } else if (uploadFields.product_item_image === "") {
      // If image was removed, send a flag to the backend
      formData.append("remove_front_image", "true");
    }

    if (uploadFields.product_item_back_image instanceof File) {
      formData.append("product_item_back_image", uploadFields.product_item_back_image);
    } else if (uploadFields.product_item_back_image === "") {
      // If image was removed, send a flag to the backend
      formData.append("remove_back_image", "true");
    }

    // Append other fields
    for (const [key, value] of Object.entries(uploadFields)) {
      if (key === "product_item_image" || key === "product_item_back_image") continue;
      formData.append(key, value);
    }

    return toast.promise(
      (async () => {
        const res = await fetchWithCsrf(`${UpdateProductURL}/${product.product_item_ID}`, {
          method: "PUT",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.errorMessage || "Update failed");

        return data;
      })(),
      {
        loading: "Updating product...",
        success: (message) => {
          router.refresh();
          closeDialog();
          return message?.successMessage ?? "Product updated successfully";
        },
        error: (e) => e.message || "Failed to update product",
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <section>
        <h3 className="font-medium text-lg mb-4">Product Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageUploadBox
              id="frontImage"
              preview={frontImagePreview}
              label="Click or drag front image"
              onRemove={() => handleRemoveImage("front")}
              onFileChange={(file) => handleFileSelect(file, "front")}
            />
            {errors.product_item_image?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {String(errors.product_item_image.message)}
                </p>
            )}
            {hasNewFrontImage && (
              <p className="text-green-600 text-sm mt-1">New front image selected</p>
            )}
          </div>
          <div>
            <ImageUploadBox
              id="backImage"
              preview={backImagePreview}
              label="Click or drag back image"
              onRemove={() => handleRemoveImage("back")}
              onFileChange={(file) => handleFileSelect(file, "back")}
            />
            {errors.product_item_back_image?.message && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors.product_item_back_image.message)}
              </p>
            )}
            {hasNewBackImage && (
              <p className="text-green-600 text-sm mt-1">New back image selected</p>
            )}
          </div>
        </div>
      </section>

      {/* Rest of your form remains the same */}
      <section>
        <h3 className="font-medium text-lg mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { label: "Product Name", name: "product_item_name", type: "text" },
            { label: "Product Price", name: "product_item_price", type: "number" },
            { label: "Discount (%)", name: "product_item_discount", type: "number" },
            { label: "Stock", name: "product_item_stock", type: "number" },
            { label: "Color", name: "product_item_color" },
            { label: "Size", name: "product_item_size" },
            { label: "Type", name: "product_item_type" },
            { label: "Fit", name: "product_item_fit" },
            { label: "Material", name: "product_item_material" },
            { label: "Construction", name: "product_item_construction" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name} className="text-sm ">
              <label className="block font-medium mb-1">{label}</label>
              <input
                disabled={isSubmitting}
                type={type}
                {...register(name as keyof uploadProductFieldsType)}
                className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            {errors[name as keyof uploadProductFieldsType]?.message && (
              <p className="text-red-500 text-sm mt-1">
                {String(errors[name as keyof uploadProductFieldsType]?.message)}
              </p>
            )}
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Design Features</label>
            <textarea
              {...register("product_item_design_features")}
              rows={3}
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
            {errors.product_item_design_features && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product_item_design_features.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select {...register("product_item_status")} className="w-full border rounded-md p-2 dark:bg-[#3B3B3B]">
              <option value="available">Available</option>
              <option value="not available">Not Available</option>
              <option value="to be deploy">To Be Deploy</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button type="button" variant="outline" onClick={closeDialog}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}