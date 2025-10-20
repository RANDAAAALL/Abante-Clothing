
export interface PDFReceiptDataProps {
    orderNumber: string;
    orderDate: string;
    recipientFirstName: string;
    recipientLastName: string;
    companyName?: string;
    addressName: string;
    apartmentName?: string;
    cityName: string;
    regionName: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    addressType: string;
    paymentMethod: string;
    totalAmount: number;
    productDetails: {
      name: string;
      color: string;
      size: string;
      qty: number;
      image?: string;
    }[];
  }
  