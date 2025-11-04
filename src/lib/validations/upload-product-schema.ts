import z from "zod";

// upload product schema
export const uploadProductSchema = z.object({
  product_item_name: z.string().min(1, "Product name is required"),
  product_item_price: z.string().min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Price must be greater than 0"),
  
  product_item_discount: z.string()
    .refine((val) => val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), 
      "Discount must be a positive number")
    .optional(),
  
    product_item_image: z
    .any()
    .refine(
      (val) =>
        val instanceof File ||
        (typeof val === "string" && val.trim().length > 0),
      "Front image is required"
    ),
  
  product_item_back_image: z
    .any()
    .refine(
      (val) =>
        val instanceof File ||
        (typeof val === "string" && val.trim().length > 0),
      "Back image is required"
    ),
  
  product_item_color: z.string().min(1, "Color is required"),
  product_item_size: z
  .string()
  .min(1, "Size is required")
  .refine(
    (val) => /^([XSMLO]+(?:\s*,\s*[XSMLO]+)*)$/i.test(val.trim()),
    {
      message:
        "Invalid format — use commas between sizes (e.g., S, M, L, XL, OS)",
    }
  ),
  product_item_type: z.string().min(1, "Type is required"),
  product_item_fit: z.string().min(1, "Fit is required"),
  product_item_material: z.string().min(1, "Material is required"),
  product_item_construction: z.string().min(1, "Construction is required"),
  product_item_design_features: z.string().min(1, "Design features is required"),
  
  product_item_stock: z.string().min(1, "Stock is required")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, "Stock must be at least 1"),
  
  product_item_status: z.enum(["available", "not available", "to be deploy"], {
    error: "Status is required",
  }),
});

export type uploadProductFieldsType = {
  product_item_name: string;
  product_item_price: string;
  product_item_discount?: string;
  product_item_image: File | string;
  product_item_back_image: File | string;
  product_item_color: string;
  product_item_size: string;
  product_item_type: string;
  product_item_fit: string;
  product_item_material: string;
  product_item_construction: string;
  product_item_design_features: string;
  product_item_stock: string;
  product_item_status: "available" | "not available" | "to be deploy";
};