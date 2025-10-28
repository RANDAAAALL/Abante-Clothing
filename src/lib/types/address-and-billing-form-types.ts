export type AddressOrBillingType = {
    address_ID: number;
    country: string;
    addressType: "shipping" | "billing";
    recipientFirstName: string;
    recipientLastName: string;
    companyName?: string | null;
    addressName: string;
    apartmentName?: string | null;
    postalCode: string;
    cityName: string;
    regionName: string;
    phoneNumber: string;
    is_selected: boolean;
  };
  
export type DefaultAddressAndBillingProps = {
    shipping: AddressOrBillingType | null;
    billing: AddressOrBillingType | null;
};
  