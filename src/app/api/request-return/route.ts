import { isAuthenticatedUser } from "@/dal/verify-user";
import { verifyCsrfToken } from "@/lib/security/csrf/verify-csrf-token";
import { UserPayload } from "@/lib/security/payloads/get-user-payload";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";
import { ReturnItemProps } from "@/lib/types/return-item-types";
export async function POST(request: NextRequest){
  const payload = await UserPayload();
  const userType = payload.user_role;

  // check if user is logged in
  if (!(await isAuthenticatedUser())) return NextResponse.redirect(`${userType === "admin" ? "/admin/login" : "/login"}`);
  if (!verifyCsrfToken(request))
      return NextResponse.json(
          { errorMessage: "Invalid CSRF Token" },
          { status: 403 }
      );

  if (!payload) return NextResponse.redirect(`${userType === "admin" ? "/admin/login" : "/login"}`);

  try{
      const { returnData } = await request.json() as { returnData: ReturnItemProps[] };
      console.log("Server -> ", returnData)

      if( returnData?.length <= 0) return NextResponse.json({ errorMessage: "Failed to submit return request." }, { status: 400 });

      // Prepare all return records in one go
      const returnRecords = returnData.map(item => {
          // Handle the image field properly for both single and multiple images
          let productImages: string[];
          
          if (Array.isArray(item?.returned_product_image)) {
              // If it's already an array, use it directly
              productImages = item.returned_product_image;
          } else if (typeof item?.returned_product_image === 'string') {
              // If it's a string, check if it's JSON array or a single URL
              try {
                  const parsed = JSON.parse(item.returned_product_image);
                  productImages = Array.isArray(parsed) ? parsed : [item.returned_product_image];
              } catch {
                  // If parsing fails, it's a single URL string
                  productImages = [item.returned_product_image];
              }
          } else {
              // Fallback to empty array
              productImages = [];
          }

          return {
              order_detail_ID: Number(item?.order_detail_ID),
              is_returned: 1,
              returned_product_name: item?.returned_product_name,
              returned_product_qty: item?.returned_product_qty,
              returned_product_size: item?.returned_product_size,
              returned_product_color: item?.returned_product_color,
              returned_product_price: item?.returned_product_price,
              returned_product_image: productImages, // Use the properly formatted array
              returned_product_reason: item?.returned_product_reason,
              request_return_date: new Date(),
          };
      });

      // Create all return requests in one database call
      await prisma.returns.createMany({
          data: returnRecords
      });

      // revalidate cache on the customer side
      revalidateTag("order-history");

      // revalidate cache on the admin side
      revalidateTag("orders");

      return NextResponse.json({ 
          successMessage: "Return request submitted successfully. Please wait for approval." 
      }, { status: 200 });

  } catch(err: unknown) {
      return NextResponse.json({ 
          errorMessage: err instanceof Error ? err.message : "Failed to submit return request."
      }, { status: 500 });
  }
}