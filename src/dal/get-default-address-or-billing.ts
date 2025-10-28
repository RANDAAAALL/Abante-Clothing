import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { redirect } from "next/navigation";
import { isAuthenticatedUser } from "./verify-user";
import prisma from "@/lib/prisma/prisma";

export const getDefaultAddressOrBilling = async () => {
  // 1️⃣ Verify authentication
  if (!await isAuthenticatedUser()) redirect("/login");

  // 2️⃣ Get user payload
  const payload = await UserPayload();
  if (!payload) redirect("/login");

  const user_ID = Number(payload.user_ID);

  // 3️⃣ Fetch all selected address records (might be 1 or 2)
  const defaultAddressAndBilling = await prisma.address.findMany({
    where: { user_ID, is_selected: true },
  });

  // 4️⃣ Separate them by type
  const defaultShipping = defaultAddressAndBilling.find(
    (addr) => addr.address_type === "shipping"
  ) ?? null;

  const defaultBilling = defaultAddressAndBilling.find(
    (addr) => addr.address_type === "billing"
  ) ?? null;

  // 5️⃣ Shape a clear response
  const parsedDefaultAddressAndBilling = {
    shipping: defaultShipping
      ? {
          address_ID: defaultShipping.address_ID,
          addressType: "shipping" as const, // 👈 add this
          recipientFirstName: defaultShipping.recipient_first_name ?? "",
          recipientLastName: defaultShipping.recipient_last_name ?? "",
          companyName: defaultShipping.company_name ?? "",
          addressName: defaultShipping.address_name ?? "",
          apartmentName: defaultShipping.apartment_name ?? "",
          postalCode: defaultShipping.postal_code ?? "",
          cityName: defaultShipping.city_name ?? "",
          regionName: defaultShipping.region_name ?? "",
          phoneNumber: defaultShipping.phone_number ?? "",
          is_selected: defaultShipping.is_selected ?? false, // 👈 add this
          country: "Philippines",
        }
      : null,
  
    billing: defaultBilling
      ? {
          address_ID: defaultBilling.address_ID,
          addressType: "billing" as const, // 👈 add this
          recipientFirstName: defaultBilling.recipient_first_name ?? "",
          recipientLastName: defaultBilling.recipient_last_name ?? "",
          companyName: defaultBilling.company_name ?? "",
          addressName: defaultBilling.address_name ?? "",
          apartmentName: defaultBilling.apartment_name ?? "",
          postalCode: defaultBilling.postal_code ?? "",
          cityName: defaultBilling.city_name ?? "",
          regionName: defaultBilling.region_name ?? "",
          phoneNumber: defaultBilling.phone_number ?? "",
          is_selected: defaultBilling.is_selected ?? false, // 👈 add this
          country: "Philippines",
        }
      : null,
  };  

  // 6️⃣ Return structured data (you can use in server action or props)
  return parsedDefaultAddressAndBilling;
};
