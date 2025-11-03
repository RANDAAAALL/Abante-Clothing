"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "../carousel/card";
import { Button } from "@/components/ui/button";
import {
  uploadProductFieldsType,
  uploadProductSchema,
} from "@/lib/validations/upload-product-schema";
import { ImageUploadBox } from "../admin-dashboard/upload-product-section/image-upload-box";
import toast from "react-hot-toast";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { UploadProductURL } from "@/lib/config";

export default function UploadProductFormContent() {
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);

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
    if (type === "front") {
        setFrontImagePreview(url);
      } else {
        setBackImagePreview(url);
    }
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
    <Card className="dark:bg-card-black-background mt-2 p-4 md:p-8 rounded-lg">
      <h2 className="text-xl font-bold text-foreground mb-4">Upload New Product</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* === Image Upload Section === */}
        <section>
          <label className="block text-sm font-medium mb-3 text-foreground">
            Product Images (Front & Back)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
                <ImageUploadBox
                id="frontImage"
                preview={frontImagePreview}
                label="Click or drag front image"
                onRemove={() => setFrontImagePreview(null)}
                onFileChange={(file) => handleFileSelect(file, "front")}
                />
                {errors.product_item_image && ( <p className="text-red-500 text-sm mt-2 ml-1">{errors.product_item_image.message}</p>)}
                </div>
            <div className="flex flex-col">

            <ImageUploadBox
            id="backImage"
            preview={backImagePreview}
            label="Click or drag back image"
            onRemove={() => setBackImagePreview(null)}
            onFileChange={(file) => handleFileSelect(file, "back")}
            />
            {errors.product_item_back_image && ( <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_back_image.message}</p>)}
            </div>
          </div>
        </section>

        {/* === Product Details Section === */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              disabled={isSubmitting}
              {...register("product_item_name")}
              placeholder="e.g. Saints"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_name && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_name.message}</p>
            )}
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Price</label>
            <input
              disabled={isSubmitting}
              type="number"
              {...register("product_item_price")}
              placeholder="e.g. 699"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_price && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_price.message}</p>
            )}
          </div>

          {/* Product Discount */}
          <div>
            <label className="block text-sm font-medium mb-1">Discount (%)</label>
            <input
              disabled={isSubmitting}
              type="number"
              {...register("product_item_discount")}
              placeholder="e.g. 10"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_discount && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_discount.message}</p>
            )}
          </div>

          {/* Product Stock */}
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              disabled={isSubmitting}
              type="number"
              {...register("product_item_stock")}
              placeholder="e.g. 25"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_stock && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_stock.message}</p>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              disabled={isSubmitting}
              {...register("product_item_color")}
              placeholder="e.g. White"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_color && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_color.message}</p>
            )}
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <input
              disabled={isSubmitting}
              {...register("product_item_size")}
              placeholder="e.g. XS, S, M, L, XL, OS"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_size && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_size.message}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input
              disabled={isSubmitting}
              {...register("product_item_type")}
              placeholder="e.g. T-Shirt"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_type && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_type.message}</p>
            )}
          </div>

          {/* Fit */}
          <div>
            <label className="block text-sm font-medium mb-1">Fit</label>
            <input
              disabled={isSubmitting}
              {...register("product_item_fit")}
              placeholder="e.g. Regular Fit"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_fit && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_fit.message}</p>
            )}
          </div>

          {/* Material */}
          <div>
            <label className="block text-sm font-medium mb-1">Material</label>
            <input
              disabled={isSubmitting}
              {...register("product_item_material")}
              placeholder="e.g. Cotton"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_material && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_material.message}</p>
            )}
          </div>

          {/* Construction */}
          <div>
            <label className="block text-sm font-medium mb-1">Construction</label>
            <input
              disabled={isSubmitting}
              {...register("product_item_construction")}
              placeholder="e.g. Double Stitch"
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_construction && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.product_item_construction.message}</p>
            )}
          </div>

          {/* Design Features */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Design Features</label>
            <textarea
              disabled={isSubmitting}
              {...register("product_item_design_features")}
              placeholder="e.g. Printed logo on chest"
              rows={3}
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground"
            />
            {errors.product_item_design_features && (
              <p className="text-red-500 text-sm ml-1">
                {errors.product_item_design_features.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register("product_item_status")}
              disabled
              className="w-full border rounded-md p-2 dark:bg-[#3B3B3B] text-foreground cursor-not-allowed opacity-50">
              {/* <option value="">Select Status</option> */}
              {/* <option value="available">Available</option>
              <option value="not available">Not Available</option> */}
              <option value="to be deploy">To Be Deploy</option>
            </select>
            {errors.product_item_status && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.product_item_status.message as string}
              </p>
            )}
          </div>
        </section>

        {/* === Buttons === */}
        <div className="flex justify-center md:justify-end gap-3 pt-3">
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload Product"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
