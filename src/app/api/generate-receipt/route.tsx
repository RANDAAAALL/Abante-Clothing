// app/api/generate-receipt/route.tsx
import { pdf } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { OrderReceiptDocument } from "@/components/ui/documents/pdf/order-receipt-document";
import { isAuthenticatedUser } from "@/data-access-layer/verify-user";

export async function POST(req: Request) {
  if (!(await isAuthenticatedUser())) {
    return NextResponse.redirect("/login");
  }

  const data = await req.json();

  const {
    orderPurchasedNumberAndDate,
    submittedFormCheckoutFormData,
    computeItems,
    itemsData,
  } = data;

  const doc = (
    <OrderReceiptDocument
      orderPurchasedNumberAndDate={orderPurchasedNumberAndDate}
      submittedFormCheckoutFormData={submittedFormCheckoutFormData}
      computeItems={computeItems}
      itemsData={itemsData}
    />
  );

  const blob = await pdf(doc).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt.pdf"`,
    },
  });
}
