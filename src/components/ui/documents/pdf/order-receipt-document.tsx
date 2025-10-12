import { Document, Page, Text, View, Image as PDFImage } from "@react-pdf/renderer";
import { OrderReceiptStyle } from "@/styles/order-receipt-style";
import { CartItemsProps } from "@/lib/types/cart-items-types";
import { ComputeItemState, OrderPurchasedNumberAndDateState } from "@/lib/store/checkout-items";
import { CheckoutFormType } from "@/lib/validations/checkout-schema";

export const OrderReceiptDocument = ({
  orderPurchasedNumberAndDate,
  submittedFormCheckoutFormData,
  computeItems,
  itemsData
}: {
  orderPurchasedNumberAndDate: OrderPurchasedNumberAndDateState,
  submittedFormCheckoutFormData: CheckoutFormType,
  computeItems: ComputeItemState,
  itemsData: CartItemsProps[],
}) => {

  return (
    <Document>
      <Page style={OrderReceiptStyle.page} size="A4">
        
        {/* header */}
        <View style={OrderReceiptStyle.header}>
          <PDFImage style={OrderReceiptStyle.logo} src={"https://res.cloudinary.com/abante-clothing/image/upload/v1760202610/abante-clothing-logo_yxirln.png"} /> 
          <Text style={OrderReceiptStyle.title}>Order Receipt</Text>
          <Text>Order No: {orderPurchasedNumberAndDate?.orderPurchasedNumber}</Text>
          <Text>{orderPurchasedNumberAndDate?.orderPurchasedDate}</Text>
        </View>

        {/* horizontal line */}
        <View style={OrderReceiptStyle.hr} />

        {/* customer Details */}
        {submittedFormCheckoutFormData && (
          <View>
            <Text style={OrderReceiptStyle.bold}>Customer Details</Text>
            <View style={OrderReceiptStyle.labelRow}>
              <Text>Recipient</Text>
              <Text>
                {submittedFormCheckoutFormData.recipientFirstName}{" "}
                {submittedFormCheckoutFormData.recipientLastName}
              </Text>
            </View>
            {submittedFormCheckoutFormData.companyName && (
              <View style={OrderReceiptStyle.labelRow}>
                <Text>Company</Text>
                <Text>{submittedFormCheckoutFormData.companyName}</Text>
              </View>
            )}
            <View style={OrderReceiptStyle.labelRow}>
              <Text>Address</Text>
              <Text>
                {submittedFormCheckoutFormData.addressName}
                {submittedFormCheckoutFormData.apartmentName
                  ? `, ${submittedFormCheckoutFormData.apartmentName}`
                  : ""}
                , {submittedFormCheckoutFormData.cityName},{" "}
                {submittedFormCheckoutFormData.regionName},{" "}
                {submittedFormCheckoutFormData.country},{" "}
                {submittedFormCheckoutFormData.postalCode}
              </Text>
            </View>
            <View style={OrderReceiptStyle.labelRow}>
              <Text>Phone</Text>
              <Text>{submittedFormCheckoutFormData.phoneNumber}</Text>
            </View>
            <View style={OrderReceiptStyle.labelRow}>
              <Text>Address Type</Text>
              <Text>{submittedFormCheckoutFormData.addressType}</Text>
            </View>
          </View>
        )}

        {/* horizontal line */}
        <View style={OrderReceiptStyle.hr} />

        {/* rrder Details */}
        <View>
          <Text style={OrderReceiptStyle.bold}>Order Details</Text>
          {itemsData?.map((item: CartItemsProps, index: number) => (
            <View key={index} style={OrderReceiptStyle.orderItemRow}>
              <View style={OrderReceiptStyle.imageContainer}>
                <PDFImage src={item.cart_item_image ?? "/images/png/tshirt_placeholder.png"}
                  style={OrderReceiptStyle.image}/>
              </View>
              <View style={OrderReceiptStyle.itemTextContainer}>
                <Text style={OrderReceiptStyle.quantity}>{item.cart_item_qty}x</Text>
                <Text style={OrderReceiptStyle.itemName}>{item.cart_item_name} - {item.cart_item_size}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* horizontal line */}
        <View style={OrderReceiptStyle.hr} />

        {/* payment Details */}
        <View>
          <Text style={OrderReceiptStyle.bold}>Payment Details</Text>
          <View style={OrderReceiptStyle.labelRow}>
            <Text>Payment Method</Text>
            <Text style={{ textTransform: "capitalize" }}>{submittedFormCheckoutFormData?.paymentMethod}</Text>
          </View>
          <View style={OrderReceiptStyle.labelRow}>
            <Text>Payment Status</Text>
            <Text style={{ color: "#1a9a00", fontWeight: "bold" }}>Paid</Text>
          </View>

          {/* horizontal line */}
          <View style={OrderReceiptStyle.hr} />

          <View style={OrderReceiptStyle.totalRow}>
            <Text>Total</Text>
            <Text>PHP{computeItems?.overallPriceResult?.toLocaleString("en-Ph")}.00</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
