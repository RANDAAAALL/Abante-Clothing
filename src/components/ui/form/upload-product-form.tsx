"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  uploadProductFieldsType,
  uploadProductSchema,
} from "@/lib/validations/upload-product-schema";
import { ImageUploadBox } from "../admin-dashboard/upload-product-section/image-upload-box";
import toast from "react-hot-toast";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { UploadProductURL } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function UploadProductFormContent() {
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
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
        product_item_status: "to be deploy"
    }
  });

  const handleFileSelect = (file: File, type: "front" | "back") => {
    const url = URL.createObjectURL(file);
    const key = type === "front" ? "product_item_image" : "product_item_back_image";

    setValue(key, file);
    if (type === "front") setFrontImagePreview(url);
    else setBackImagePreview(url);
  };

  const onSubmit = async (uploadFields: uploadProductFieldsType) => {
    // console.log("Uploaded datas: ",uploadFields);
    const formData = new FormData();
  
    // Append files
    formData.append("product_item_image", uploadFields.product_item_image);
    formData.append("product_item_back_image", uploadFields.product_item_back_image);
  
    // Append all other fields (strings)
    for (const [key, value] of Object.entries(uploadFields)) {
      // Skip files since they are already appended
      if (key === "product_item_image" || key === "product_item_back_image") continue;
      formData.append(key, value);
    }
  
    return toast.promise(
      (async () => {
        const res = await fetchWithCsrf(`${UploadProductURL}`, {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data?.errorMessage || "Upload failed");
  
        return data;
      })(),
      {
        loading: "Uploading new product...",
        success: (message) => {
            router.refresh();
            reset();
            setFrontImagePreview(null);
            setBackImagePreview(null);
            return message?.successMessage;
        },
        error: (e) => e.message || "Failed to upload new product",
      }
    );
  };  

  const handleClear = () => {
    reset();
    setFrontImagePreview(null);
    setBackImagePreview(null);
  };

 
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-3">
        <p className="text-sm text-muted-foreground mt-1">
          Fill out all the required fields to add a new product.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-10">
        {/* === Product Images === */}
        <section>
          <h3 className="font-medium text-lg mb-4">Product Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front */}
            <div>
              <ImageUploadBox
                id="frontImage"
                preview={frontImagePreview}
                label="Click or drag front image"
                onRemove={() => setFrontImagePreview(null)}
                onFileChange={(file) => handleFileSelect(file, "front")}/>
              {errors.product_item_image && (
                <p className="text-red-500 text-sm mt-1">{errors.product_item_image.message}</p>
              )}
            </div>

            {/* Back */}
            <div>
              <ImageUploadBox
                id="backImage"
                preview={backImagePreview}
                label="Click or drag back image"
                onRemove={() => setBackImagePreview(null)}
                onFileChange={(file) => handleFileSelect(file, "back")}
              />
              {errors.product_item_back_image && (
                <p className="text-red-500 text-sm mt-1">{errors.product_item_back_image.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* === Product Details === */}
        <section>
          <h3 className="font-medium text-lg mb-4">Product Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Product Name", name: "product_item_name", placeholder: "e.g. Saints" },
              { label: "Product Price", name: "product_item_price", placeholder: "e.g. 699", type: "number" },
              { label: "Discount (%)", name: "product_item_discount", placeholder: "e.g. 10", type: "number" },
              { label: "Stock", name: "product_item_stock", placeholder: "e.g. 25", type: "number" },
              { label: "Color", name: "product_item_color", placeholder: "e.g. White" },
              { label: "Size", name: "product_item_size", placeholder: "e.g. XS, S, M, L, XL, OS" },
              { label: "Type", name: "product_item_type", placeholder: "e.g. T-Shirt" },
              { label: "Fit", name: "product_item_fit", placeholder: "e.g. Regular Fit" },
              { label: "Material", name: "product_item_material", placeholder: "e.g. Cotton" },
              { label: "Construction", name: "product_item_construction", placeholder: "e.g. Double Stitch" },
            ].map(({ label, name, placeholder, type = "text" }) => (
              <div key={name} className="text-sm ">
                <label className="block font-medium mb-1">{label}</label>
                <input
                  disabled={isSubmitting}
                  type={type}
                  {...register(name as keyof uploadProductFieldsType)}
                  placeholder={placeholder}
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
                disabled={isSubmitting}
                {...register("product_item_design_features")}
                placeholder="e.g. Printed logo on chest"
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
              <select
                {...register("product_item_status")}
                disabled
                className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground cursor-not-allowed opacity-70"
              >
                <option value="to be deploy">To Be Deploy</option>
              </select>
            </div>
          </div>
        </section>

        {/* === Action Buttons === */}
        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}