// app/api/generate-receipt/route.tsx
import { pdf } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { OrderReceiptDocument } from "@/components/ui/documents/pdf/order-receipt-document";
import { isAuthenticatedUser } from "@/dal/verify-user";

export async function POST(req: Request) {
  if (!(await isAuthenticatedUser())) {
    return NextResponse.redirect("/login");
  }
  const { receiptData } = await req.json();

  const doc = <OrderReceiptDocument receiptData={receiptData} />;

  const blob = await pdf(doc).toBlob();

  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="receipt.pdf"`,
    },
  });
}
