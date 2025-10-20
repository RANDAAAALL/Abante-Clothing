// components/ui/documents/pdf/order-receipt-document.tsx
import { Document, Page, Text, View, Image as PDFImage } from "@react-pdf/renderer";
import { OrderReceiptStyle } from "@/styles/order-receipt-style";
import { PDFReceiptDataProps } from "@/lib/types/pdf-order-receipt-types";
import { firstLetterUpcase } from "@/lib/helper/first-letter-uppercase";

export const OrderReceiptDocument = ({ receiptData }: { receiptData: PDFReceiptDataProps }) => {
  return (
    <Document>
      <Page style={OrderReceiptStyle.page} size="A4">
        {/* HEADER */}
        <View style={OrderReceiptStyle.header}>
          <PDFImage
            style={OrderReceiptStyle.logo}
            src="https://res.cloudinary.com/abante-clothing/image/upload/v1760202610/abante-clothing-logo_yxirln.png"
          />
          <Text style={OrderReceiptStyle.title}>Order Receipt</Text>
          <Text>Order No: {receiptData.orderNumber}</Text>
          <Text>{receiptData.orderDate}</Text>
        </View>

        <View style={OrderReceiptStyle.hr} />

        {/* CUSTOMER DETAILS */}
        <Text style={OrderReceiptStyle.bold}>Customer Details</Text>
        <View style={OrderReceiptStyle.labelRow}>
          <Text>Recipient</Text>
          <Text>{receiptData.recipientFirstName} {receiptData.recipientLastName}</Text>
        </View>
        {receiptData.companyName && (
          <View style={OrderReceiptStyle.labelRow}>
            <Text>Company</Text>
            <Text>{receiptData.companyName}</Text>
          </View>
        )}
        <View style={OrderReceiptStyle.labelRow}>
          <Text>Address</Text>
          <Text>
            {receiptData.addressName}
            {receiptData.apartmentName ? `, ${receiptData.apartmentName}` : ""}, {receiptData.cityName},{" "}
            {receiptData.regionName}, {receiptData.country}, {receiptData.postalCode}
          </Text>
        </View>
        <View style={OrderReceiptStyle.labelRow}>
          <Text>Phone</Text>
          <Text>{receiptData.phoneNumber}</Text>
        </View>
        <View style={OrderReceiptStyle.labelRow}>
          <Text>Address Type</Text>
          <Text>{receiptData.addressType}</Text>
        </View>

        <View style={OrderReceiptStyle.hr} />

        {/* ORDER DETAILS */}
        <Text style={OrderReceiptStyle.bold}>Order Details</Text>
        {receiptData.productDetails.map((p, idx) => (
          <View key={idx} style={OrderReceiptStyle.orderItemRow}>
            <View style={OrderReceiptStyle.imageContainer}>
              <PDFImage src={p.image ?? "/images/png/tshirt_placeholder.png"} style={OrderReceiptStyle.image} />
            </View>
            <View style={OrderReceiptStyle.itemTextContainer}>
              <Text style={OrderReceiptStyle.quantity}>{p.qty}<Text>x</Text></Text>
              <Text style={OrderReceiptStyle.itemName}>{p.color}</Text>
              <Text>{p.name[0].toUpperCase() + p.name.slice(1)} - {p.size}</Text>
            </View>
          </View>
        ))}

        <View style={OrderReceiptStyle.hr} />

        {/* PAYMENT */}
        <Text style={OrderReceiptStyle.bold}>Payment Details</Text>
        <View style={OrderReceiptStyle.labelRow}>
          <Text>Payment Method</Text>
          <Text>{firstLetterUpcase(receiptData.paymentMethod)}</Text>
        </View>
        <View style={OrderReceiptStyle.labelRow}>
          <Text>Payment Status</Text>
          <Text style={{ color: "#1a9a00", fontWeight: "bold" }}>Paid</Text>
        </View>

        <View style={OrderReceiptStyle.hr} />

        <View style={OrderReceiptStyle.totalRow}>
          <Text>Total</Text>
          <Text>PHP{receiptData.totalAmount.toLocaleString("en-Ph")}.00</Text>
        </View>
      </Page>
    </Document>
  );
};
