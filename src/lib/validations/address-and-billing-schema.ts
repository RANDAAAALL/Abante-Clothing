import z from "zod";

export const AddressAndBillingSchema = z.object({
  country: z.literal("Philippines"),

  recipientFirstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .regex(/^[A-Za-z\s]+$/, "First name must not contain special characters"),

  recipientLastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .regex(/^[A-Za-z\s]+$/, "Last name must not contain special characters"),

  companyName: z.string().trim().optional(),
  apartmentName: z.string().trim().optional(),

  addressName: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters long"),

  postalCode: z
    .string()
    .trim()
    .regex(/^\d{4,5}$/, "Postal code must be 4–5 digits long"),

  cityName: z
    .string()
    .trim()
    .min(2, "City name is required")
    .regex(/^[A-Za-z\s]+$/, "City name must only contain letters"),

  regionName: z
    .string()
    .trim()
    .min(1, "Region name is required"),

  phoneNumber: z
  .string()
  .transform((val) => val.replace(/\s+/g, "")) 
  .transform((val) => {
    // Normalize to +639XXXXXXXXX format
    if (val.startsWith("+639")) return val;
    if (val.startsWith("639")) return "+63" + val.slice(2);
    if (val.startsWith("09")) return "+63" + val.slice(1);
    if (val.startsWith("9")) return "+63" + val;
    return val; // fallback
  })
  .refine(
    (val) => /^\+639\d{9}$/.test(val),
    { message: "Invalid phone number. Must start with +639, 639, 09, or 9 and contain 11 digits in total." }
  )
});

export type AddressAndBillingType = z.infer<typeof AddressAndBillingSchema>;
