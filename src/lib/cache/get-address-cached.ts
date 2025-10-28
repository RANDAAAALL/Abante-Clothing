import { unstable_cache } from "next/cache";
import prisma from "../prisma/prisma";
import { AddressProps } from "../types/address-types";

export const getAddressCached = unstable_cache(async (user_ID: number) => {
    const addressData = await prisma.address.findMany({
        where: { 
            user_ID: Number(user_ID),
            address_type: "shipping"
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
            },
        orderBy: { address_ID: 'desc' }
    });

    const parsedAddressData: AddressProps[] = addressData.map(address => ({
        country: "Philippines",
        address_ID: address?.address_ID ?? 0,
        recipientFirstName: address?.recipient_first_name ?? "-",
        recipientLastName: address?.recipient_last_name ?? "-",
        companyName: address?.company_name ?? "-",
        addressName: address?.address_name ?? "-",
        apartmentName: address?.apartment_name ?? "-",
        postalCode: address?.postal_code ?? "-",
        cityName: address?.city_name ?? "-",
        regionName: address?.region_name ?? "-",
        phoneNumber: address?.phone_number ?? "-",
        is_selected: address?.is_selected ?? false,
    }))

    return parsedAddressData
}, ['shipping'], { tags: ['shipping']});