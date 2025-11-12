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
        is_selected: true,

        order_purchased_order_purchased_billing_address_IDToaddress: {
          select: {
              billing_address_ID: true,
          }
        }
      },
      orderBy: { address_ID: 'desc' },
    });
  
    const parsedBillingData: BillingProps[] = billingData.map(address => ({
      country: 'Philippines',
      address_ID: address.address_ID ?? 0,
      billingFirstName: address.recipient_first_name ?? "",
      billingLastName: address.recipient_last_name ?? "",
      billingCompanyName: address.company_name ?? "",
      billingAddressName: address.address_name ?? "",
      billingApartmentName: address.apartment_name ?? "",
      billingPostalCode: address.postal_code ?? "",
      billingCityName: address.city_name ?? "",
      billingRegionName: address.region_name ?? "",
      billingPhoneNumber: address.phone_number ?? "",
      is_selected: address.is_selected ?? false,
      hasActiveOrder: address.order_purchased_order_purchased_billing_address_IDToaddress
        ?.some(order => order.billing_address_ID === address.address_ID),
    }));

    return parsedBillingData
  }, ['billing'], { tags: ['billing'] });
  