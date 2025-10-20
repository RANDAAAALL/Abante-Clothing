import { StyleSheet } from "@react-pdf/renderer"

export const OrderReceiptStyle = StyleSheet.create({
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
    bold: { fontWeight: "bold", marginBottom: 8, fontSize: 14 },
    hr: { borderBottomWidth: 1, borderBottomColor: "#000", marginVertical: 10 },
    orderItemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    imageContainer: { width: 60, height: 60, marginRight: 10},
    image: { width: 60, height: 60, objectFit: "contain"},
    logo: { width: 70, height: 70, alignSelf: "center", marginBottom: 2 },
    itemTextContainer: { flexDirection: "column", columnGap: 2},
    quantity: { fontWeight:"bold", textAlign: "right", alignSelf: "flex-end", marginBottom: 2},
    color: { textTransform: "capitalize", textAlign: "right", alignSelf: "flex-end", marginBottom: 2},
    itemName: { textTransform: "capitalize", textAlign: "right", alignSelf: "flex-end"},
    totalRow: { flexDirection: "row", justifyContent: "space-between", fontSize: 14, fontWeight: "bold" },
  });