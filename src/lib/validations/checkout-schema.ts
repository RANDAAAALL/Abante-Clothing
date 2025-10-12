import { z } from "zod";

export const CheckoutSchema = z.object({
   country: z.enum(["Philippines"], {
    error: () => ({ message: "Please select a valid country"}),
  }),
  recipientFirstName: z
  .string()
  .min(1, "First name is required")
  .regex(/^[A-Za-z\s]+$/, "First name must not contain special characters"),
  recipientLastName: z
  .string()
  .min(1, "Last name is required")
  .regex(/^[A-Za-z\s]+$/, "Last name must not contain special characters"),
  companyName: z.string().optional(),
  addressName: z
  .string()
  .min(5, "Address must be at least 5 characters long")
  .regex(/^[A-Za-z0-9\s,.'-]+$/, "Address contains invalid characters"),
  apartmentName: z.string().optional(),
  postalCode: z
  .string()
  .regex(/^\d{4,5}$/, "Postal code must be 4–5 digits long"),
  cityName: z
  .string()
  .min(2, "City name is required")
  .regex(/^[A-Za-z\s]+$/, "City name must only contain letters"),
  regionName: z
  .string()
  .min(1, "Region name is required")
  .regex(/^[A-Za-z0-9\s]+$/, "Special characters are not allowed"),
  phoneNumber: z
  .string()
  .transform((val) => val.replace(/\s+/g, ""))
  .refine(
    (val) =>
      /^(09\d{9}|9\d{9}|\+639\d{9}|639\d{9})$/.test(val),
    {
      message: "Invalid phone number format",
    }
  )
  .transform((val) => {
    if (val.startsWith("09")) return "+63" + val.slice(1);
    if (val.startsWith("9")) return "+63" + val;
    if (val.startsWith("639")) return "+63" + val.slice(2);
    return val; 
  }),
  saveInformation: z.boolean().optional(),
  paymentMethod: z.enum(["gcash", "paymaya", "bank-transfer"], {
    error: () => ({ message: "Please select a payment method."})
  }),
  addressType: z.enum(["shipping-address", "billing-address"], {
    error: () => ({ message: "Please select a billing address"})
  }),
  billingRecipientFirstName: z.string().optional(),
  billingRecipientLastName: z.string().optional(),
  billingCompanyName: z.string().optional(),
  billingAddressName: z.string().optional(),
  billingApartmentName: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCityName: z.string().optional(),
  billingRegionName: z.string().optional(),
  billingPhoneNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.addressType === "billing-address") {
    const requiredBillingFields = {
      billingRecipientFirstName: "Billing first name is required",
      billingRecipientLastName: "Billing last name is required",
      billingAddressName: "Billing address is required",
      billingPostalCode: "Billing postal code is required",
      billingCityName: "Billing city is required",
      billingRegionName: "Billing region is required",
      billingPhoneNumber: "Billing phone number is required",
    };

    for (const [field, message] of Object.entries(requiredBillingFields)) {
      if (!data[field as keyof typeof data]) {
        ctx.addIssue({
          code: "custom",
          path: [field],
          message,
        });
      }
    }
  }
});


export type CheckoutFormType = z.infer<typeof CheckoutSchema>;
