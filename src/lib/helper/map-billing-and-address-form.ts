import { AddressAndBillingType } from "../validations/address-and-billing-schema";
import { BillingProps } from "../types/billing-types";
import { AddressProps } from "../types/address-types";

export const mapBillingAndAddressToFormSchema = (data: BillingProps | AddressProps): AddressAndBillingType => {
  const isBilling = (data as BillingProps).billingFirstName !== undefined;

  if (isBilling) {
    const billing = data as BillingProps;
    return {
      country: (data.country as "Philippines") ?? "Philippines",
      recipientFirstName: billing.billingFirstName ?? "",
      recipientLastName: billing.billingLastName ?? "",
      companyName: billing.billingCompanyName ?? "",
      apartmentName: billing.billingApartmentName ?? "",
      addressName: billing.billingAddressName ?? "",
      postalCode: billing.billingPostalCode ?? "",
      cityName: billing.billingCityName ?? "",
      regionName: billing.billingRegionName ?? "",
      phoneNumber: billing.billingPhoneNumber ?? "",
    };
  }

  const address = data as AddressProps;
  return {
    country: (data.country as "Philippines") ?? "Philippines",
    recipientFirstName: address.recipientFirstName ?? "",
    recipientLastName: address.recipientLastName ?? "",
    companyName: address.companyName ?? "",
    apartmentName: address.apartmentName ?? "",
    addressName: address.addressName ?? "",
    postalCode: address.postalCode ?? "",
    cityName: address.cityName ?? "",
    regionName: address.regionName ?? "",
    phoneNumber: address.phoneNumber ?? "",
  };
};
