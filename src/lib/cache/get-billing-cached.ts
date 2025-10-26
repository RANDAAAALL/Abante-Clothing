import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { BillingProps } from "../types/billing-types";
export const getBillingCached = unstable_cache(async (user_ID: number) => {
    const billingData = await prisma.address.findMany({
      where: { 
        user_ID: Number(user_ID),
        address_type: 'billing', 
      },
      select: {
        address_ID: true,
        recipient_first_name: true,
        recipient_last_name: true,
        company_name: true,
        address_name: true,
        apartment_name: true,
        postal_code: true,
        city_name: true,
        region_name: true,
        phone_number: true,
      },
      orderBy: { address_ID: 'desc' },
    });
  
    const parsedBillingData: BillingProps[] = billingData.map(addr => ({
      country: 'Philippines',
      address_ID: addr.address_ID ?? 0,
      billingFirstName: addr.recipient_first_name ?? "",
      billingLastName: addr.recipient_last_name ?? "",
      billingCompanyName: addr.company_name ?? "",
      billingAddressName: addr.address_name ?? "",
      billingApartmentName: addr.apartment_name ?? "",
      billingPostalCode: addr.postal_code ?? "",
      billingCityName: addr.city_name ?? "",
      billingRegionName: addr.region_name ?? "",
      billingPhoneNumber: addr.phone_number ?? "",
    }));
  
    return parsedBillingData;
  }, ['billing'], { tags: ['billing'] });
  