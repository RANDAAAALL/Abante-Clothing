import { pdf } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { OrderReceiptDocument } from "@/components/ui/documents/pdf/order-receipt-document";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticatedUser())) return NextResponse.redirect("/login");    
  if(!verifyCsrfToken(req)) return NextResponse.json({ errorMessage: "Invalid CSRF Token" }, { status: 403 }); 

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
