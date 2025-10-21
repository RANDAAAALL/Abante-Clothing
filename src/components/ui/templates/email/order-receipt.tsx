import { PDFReceiptDataProps } from "@/lib/types/pdf-order-receipt-types";

export const generateOrderReceiptHTML = (receiptData: PDFReceiptDataProps) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Order Receipt</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0 0 17px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
        
        <!-- HEADER -->
        <tr>
          <td align="center" style="padding: 30px;">
            <img src="https://res.cloudinary.com/abante-clothing/image/upload/v1760202610/abante-clothing-logo_yxirln.png"
                 alt="Abante Clothing Logo"
                 style="width: 120px; height: auto; margin-bottom: 10px;" />
            <h2 style="margin: 5px 0; font-size: 22px; color: #333;">Order Receipt</h2>
            <p style="margin: 0; color: #555;">Order No: ${receiptData.orderNumber}</p>
            <p style="margin: 0; color: #555;">${receiptData.orderDate}</p>
          </td>
        </tr>
  
        <tr><td style="border-top: 1px solid #ddd;"></td></tr>
  
        <!-- CUSTOMER DETAILS -->
        <tr>
          <td style="padding: 20px;">
            <h3 style="font-size: 18px; margin: 0 0 10px; color: #333;">Customer Details</h3>
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #444;">
              <tr>
                <td width="40%">Recipient</td>
                <td>${receiptData.recipientFirstName} ${receiptData.recipientLastName}</td>
              </tr>
              ${receiptData.companyName ? `
              <tr>
                <td>Company</td>
                <td>${receiptData.companyName}</td>
              </tr>` : ""}
              <tr>
                <td>Address</td>
                <td>${receiptData.addressName}${receiptData.apartmentName ? `, ${receiptData.apartmentName}` : ""}, 
                  ${receiptData.cityName}, ${receiptData.regionName}, ${receiptData.country}, ${receiptData.postalCode}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>${receiptData.phoneNumber}</td>
              </tr>
              <tr>
                <td>Address Type</td>
                <td>${receiptData.addressType}</td>
              </tr>
            </table>
          </td>
        </tr>
  
        <tr><td style="border-top: 1px solid #ddd;"></td></tr>
  
        <!-- ORDER DETAILS -->
        <tr>
          <td style="padding: 20px;">
            <h3 style="font-size: 18px; margin: 0 0 10px; color: #333;">Order Details</h3>
            ${receiptData.productDetails.map((p) => `
              <table width="100%" cellpadding="6" cellspacing="0" style="margin-bottom: 10px; border-bottom: 1px solid #eee;">
                <tr>
                  <td width="80" valign="top">
                    <img src="${p.image ?? "https://res.cloudinary.com/abante-clothing/image/upload/v1760202610/tshirt_placeholder.png"}"
                         alt="${p.name}"
                         style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover;" />
                  </td>
                  <td valign="middle" style="font-size: 14px; color: #333;">
                    <p style="margin: 0;">
                      <strong>${p.qty}x</strong>
                      <span style="margin-left: 4px;">${p.color[0].toUpperCase() + p.color.slice(1)}</span>
                    </p>
                    <p style="margin: 2px 0;">${p.name[0].toUpperCase() + p.name.slice(1)} - ${p.size}</p>
                  </td>
                </tr>
              </table>
            `).join("")}
          </td>
        </tr>
  
        <tr><td style="border-top: 1px solid #ddd;"></td></tr>
  
        <!-- PAYMENT DETAILS -->
        <tr>
          <td style="padding: 20px;">
            <h3 style="font-size: 18px; margin: 0 0 10px; color: #333;">Payment Details</h3>
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 14px; color: #444;">
              <tr>
                <td width="40%">Payment Method</td>
                <td>${receiptData.paymentMethod[0].toUpperCase() + receiptData.paymentMethod.slice(1)}</td>
              </tr>
              <tr>
                <td>Payment Status</td>
                <td style="color: #1a9a00; font-weight: bold;">Paid</td>
              </tr>
            </table>
          </td>
        </tr>
  
        <tr><td style="border-top: 1px solid #ddd;"></td></tr>
  
        <!-- TOTAL -->
        <tr>
          <td style="padding: 20px;">
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 16px; color: #333; font-weight: bold;">
              <tr>
                <td>Total</td>
                <td align="right">PHP${Number(receiptData.totalAmount).toLocaleString("en-PH")}.00</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
            <td style="text-align: center; padding: 15px 20px; color: #999; font-size: 12px;">
                Thank you for shopping with Abante Clothing!
            </td>
        </tr>
        </table>
    </body>
    </html>
    `;
  };
  