
import { generateOrderReceiptHTML } from "@/components/ui/templates/email/order-receipt";
import { getUserInfo } from "@/dal/get-user-info";
import { isAuthenticatedUser } from "@/dal/verify-user";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if(!await isAuthenticatedUser()) return redirect("/login");

  const receiptData = await req.json();
  const payload = await getUserInfo();

  const htmlContent = generateOrderReceiptHTML(receiptData);

  try{
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY!,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: "lesterandig17@gmail.com", name: "Abante Clothing" },
          to: [{ email: payload?.email }],
          subject: "Your Order Receipt",
          htmlContent,
        }),
      });
    
      const data = await res.json();
      if(!res.ok) throw new Error(data?.message || "Failed to send receipt email.");
      
      return NextResponse.json({ successMessage: "Receipt email sent successfully." }, { status: 200 });
  }catch(err: unknown){
    return NextResponse.json({ errorMessage: `${err instanceof Error ? err.message : "Failed to send receipt email." }` }, { status: 500 });
  }
}
