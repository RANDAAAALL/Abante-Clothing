import z from "zod";
import { validateFilenamePattern } from "../helper/validate-file-name-pattern";

export const uploadProductSchema = z
  .object({
    product_item_name: z.string().min(1, "Product name is required"),
    product_item_price: z
      .string()
      .min(1, "Price is required")
      .refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        "Price must be greater than 0"
      ),

    product_item_discount: z
      .string()
      .refine(
        (val) =>
          val === "" || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
        "Discount must be a positive number"
      )
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
    product_item_design_features: z
      .string()
      .min(1, "Design features is required"),

    product_item_stock: z
      .string()
      .min(1, "Stock is required")
      .refine(
        (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
        "Stock must be at least 1"
      ),

      product_item_status: z.enum(["available", "not available", "to be deploy"], {
        message: "Invalid product status",
      }),
  })
  .superRefine((data, ctx) => {
    const { product_item_image, product_item_back_image, product_item_name, product_item_color } = data;
  
    // if (!product_item_name || !product_item_color) return;

    // --- FRONT IMAGE VALIDATION ---
    if (product_item_image instanceof File) {
      const isValid = validateFilenamePattern(
        product_item_image.name,
        product_item_name,
        product_item_color,
        false
      );
      if (!isValid) {
        const formattedName = product_item_name.toLowerCase().replace(/\s+/g, "-");
        const formattedColor = product_item_color.toLowerCase().replace(/\s+/g, "-");
        const expectedName = `abante-t-shirt-${formattedName}-${formattedColor}`;
        ctx.addIssue({
          code: "custom",
          path: ["product_item_image"],
          message: `Front image must be named: ${expectedName}.jpg/png`,
        });
      }
    }
  
    // --- BACK IMAGE VALIDATION ---
    if (product_item_back_image instanceof File) {
      const isValid = validateFilenamePattern(
        product_item_back_image.name,
        product_item_name,
        product_item_color,
        true
      );
      if (!isValid) {
        const formattedName = product_item_name.toLowerCase().replace(/\s+/g, "-");
        const formattedColor = product_item_color.toLowerCase().replace(/\s+/g, "-");
        const expectedName = `abante-t-shirt-${formattedName}-${formattedColor}-back-image`;
        ctx.addIssue({
          code: "custom",
          path: ["product_item_back_image"],
          message: `Back image must be named: ${expectedName}.jpg/png`,
        });
      }
    }
  });
    
export type uploadProductFieldsType = z.infer<typeof uploadProductSchema>;
