import { ComputeItemState } from "@/lib/store/checkout-items";
import { CheckoutFormType } from "@/lib/validations/checkout-schema";
import { Document, Page, Text, View, StyleSheet, Image as PDFImage } from "@react-pdf/renderer";

export const OrderReceiptDocument = ({
  orderNumber,
  date,
  submittedFormCheckoutFormData,
  computeItems,
  cartData,
}: {
  orderNumber: string;
  date: string;
  submittedFormCheckoutFormData: CheckoutFormType;
  computeItems: ComputeItemState;
  cartData: CartItemsProps[];
}) => {
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontSize: 12,
      fontFamily: "Helvetica",
      backgroundColor: "#fff",
      color: "#333",
      alignSelf: "center",
      height: "auto",
    },
    header: { textAlign: "center", marginBottom: 15 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    labelRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
    bold: { fontWeight: "bold", marginBottom: 8, fontSize: "14px" },
    hr: { borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 10 },
    orderItemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    imageContainer: { width: 60, height: 60, marginRight: 10},
    image: { width: 60, height: 60, objectFit: "contain"},
    logo: { width: 70, height: 70, objectFit: "contain", alignSelf: "center", marginBottom: 2 },
    itemTextContainer: { flexDirection: "column"},
    quantity: { fontWeight:"bold", textAlign: "right", alignSelf: "flex-end", marginBottom: 2},
    itemName: { textTransform: "capitalize", textAlign: "right", alignSelf: "flex-end"},
    totalRow: { flexDirection: "row", justifyContent: "space-between", fontSize: 14, fontWeight: "bold" },
  });

  return (
    <Document>
      <Page style={styles.page} size="A4">
        
        {/* header */}
        <View style={styles.header}>
          <PDFImage style={styles.logo} src={"https://res.cloudinary.com/abante-clothing/image/upload/v1760202610/abante-clothing-logo_yxirln.png"} /> 
          <Text style={styles.title}>Order Receipt</Text>
          <Text>Order No: {orderNumber}</Text>
          <Text>{date}</Text>
        </View>

        {/* horizontal line */}
        <View style={styles.hr} />

        {/* customer Details */}
        {submittedFormCheckoutFormData && (
          <View>
            <Text style={styles.bold}>Customer Details</Text>
            <View style={styles.labelRow}>
              <Text>Recipient</Text>
              <Text>
                {submittedFormCheckoutFormData.recipientFirstName}{" "}
                {submittedFormCheckoutFormData.recipientLastName}
              </Text>
            </View>
            {submittedFormCheckoutFormData.companyName && (
              <View style={styles.labelRow}>
                <Text>Company</Text>
                <Text>{submittedFormCheckoutFormData.companyName}</Text>
              </View>
            )}
            <View style={styles.labelRow}>
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
            <View style={styles.labelRow}>
              <Text>Phone</Text>
              <Text>{submittedFormCheckoutFormData.phoneNumber}</Text>
            </View>
            <View style={styles.labelRow}>
              <Text>Address Type</Text>
              <Text>{submittedFormCheckoutFormData.addressType}</Text>
            </View>
          </View>
        )}

        {/* horizontal line */}
        <View style={styles.hr} />

        {/* rrder Details */}
        <View>
          <Text style={styles.bold}>Order Details</Text>
          {cartData?.map((item: CartItemsProps, index: number) => (
            <View key={index} style={styles.orderItemRow}>
              <View style={styles.imageContainer}>
                <PDFImage src={item.cart_item_image ?? "/images/png/tshirt_placeholder.png"}
                  style={styles.image}/>
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.quantity}>{item.cart_item_qty}x</Text>
                <Text style={styles.itemName}>{item.cart_item_name} - {item.cart_item_size}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* horizontal line */}
        <View style={styles.hr} />

        {/* payment Details */}
        <View>
          <Text style={styles.bold}>Payment Details</Text>
          <View style={styles.labelRow}>
            <Text>Payment Method</Text>
            <Text style={{ textTransform: "capitalize" }}>{submittedFormCheckoutFormData.paymentMethod}</Text>
          </View>
          <View style={styles.labelRow}>
            <Text>Payment Status</Text>
            <Text style={{ color: "#1a9a00", fontWeight: "bold" }}>Paid</Text>
          </View>

          {/* horizontal line */}
          <View style={styles.hr} />

          <View style={styles.totalRow}>
            <Text>Total</Text>
            <Text>PHP{computeItems.overallPriceResult?.toLocaleString("en-Ph")}.00</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
