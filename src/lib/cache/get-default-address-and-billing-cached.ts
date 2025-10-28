import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";

export const getDefaultAddressAndBillingCached = unstable_cache(async (user_ID: number) => {
  // fetch all selected address records
  const defaultAddressAndBilling = await prisma.address.findMany({
    where: { user_ID, is_selected: true },
  });

  // separate by type
  const defaultShipping = defaultAddressAndBilling.find(
    (addr) => addr.address_type === "shipping"
  ) ?? null;

  const defaultBilling = defaultAddressAndBilling.find(
    (addr) => addr.address_type === "billing"
  ) ?? null;

  // parsed for a clear response
  const parsedDefaultAddressAndBilling = {
    shipping: defaultShipping
      ? {
          address_ID: defaultShipping.address_ID,
          addressType: "shipping" as const, 
          recipientFirstName: defaultShipping.recipient_first_name ?? "",
          recipientLastName: defaultShipping.recipient_last_name ?? "",
          companyName: defaultShipping.company_name ?? "",
          addressName: defaultShipping.address_name ?? "",
          apartmentName: defaultShipping.apartment_name ?? "",
          postalCode: defaultShipping.postal_code ?? "",
          cityName: defaultShipping.city_name ?? "",
          regionName: defaultShipping.region_name ?? "",
          phoneNumber: defaultShipping.phone_number ?? "",
          is_selected: defaultShipping.is_selected ?? false, 
          country: "Philippines",
        }
      : null,
  
    billing: defaultBilling
      ? {
          address_ID: defaultBilling.address_ID,
          addressType: "billing" as const, 
          recipientFirstName: defaultBilling.recipient_first_name ?? "",
          recipientLastName: defaultBilling.recipient_last_name ?? "",
          companyName: defaultBilling.company_name ?? "",
          addressName: defaultBilling.address_name ?? "",
          apartmentName: defaultBilling.apartment_name ?? "",
          postalCode: defaultBilling.postal_code ?? "",
          cityName: defaultBilling.city_name ?? "",
          regionName: defaultBilling.region_name ?? "",
          phoneNumber: defaultBilling.phone_number ?? "",
          is_selected: defaultBilling.is_selected ?? false,
          country: "Philippines",
        }
      : null,
  };  

  return parsedDefaultAddressAndBilling;

}, ["get-address-and-billing"], { tags: ["get-address-and-billing"] });