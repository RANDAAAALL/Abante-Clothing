import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { revalidateTag } from "next/cache";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_detail_ID, return_accepted } = body;

    if (!order_detail_ID) {
      return NextResponse.json(
        { errorMessage: "Missing order_detail_ID" },
        { status: 400 }
      );
    }

    // 1️⃣ Update the return status of this specific order detail
    const updatedDetail = await prisma.order_details.update({
      where: { order_detail_ID },
      data: { return_accepted },
    });

    // 2️⃣ Fetch the parent order using the correct FK: order_purchased_ID
    const order = await prisma.order_purchased.findUnique({
      where: { order_purchased_ID: updatedDetail.order_purchased_ID! },
      include: { order_details: true },
    });

    // 3️⃣ If all items in that order are returned & accepted, mark the order as "returned"
    if (order) {
      const allReturnedAccepted = order.order_details.every(
        (d) => d.is_returned && d.return_accepted
      );

      if (allReturnedAccepted) {
        await prisma.order_purchased.update({
          where: { order_purchased_ID: order.order_purchased_ID },
          data: { order_purchased_status: "returned" },
        });
      }
    }

    // revalidate to get the fresh data
    revalidateTag("orders");

    // 4️⃣ Respond with success
    return NextResponse.json({
      successMessage: "Return status updated successfully.",
    });
  } catch (error) {
    console.error("Error updating return status:", error);
    return NextResponse.json(
      { errorMessage: "Failed to update return status." },
      { status: 500 }
    );
  }
}
