"use client";
import { Button } from "@/components/ui/button";
import { ProductLineProps } from "@/lib/interface/product-line";

export function ProductLine({ orderDetail, onViewReturn }: ProductLineProps) {
  const hasAcceptedReturn = orderDetail.returns?.some(r => r.is_returned === 1 && r.is_return_accepted === "Accepted");
  const hasPendingReturn = orderDetail.returns?.some(r => r.is_returned === 1 && r.is_return_accepted === null);
  const hasRejectedReturn = orderDetail.returns?.some(r => r.is_returned === 1 && r.is_return_accepted === "Rejected");

  const lineThroughClass = hasAcceptedReturn 
    ? "line-through decoration-red-800 decoration-3" 
    : hasPendingReturn 
    ? "line-through decoration-red-800 decoration-1" 
    : hasRejectedReturn
    ? "line-through decoration-red-800 decoration-2" 
    : "";

  return (
    <div className="flex flex-col gap-1 border-b last:border-b-0 py-1">
      <div className="flex items-center justify-between">
        <div className={`flex items-center flex-wrap gap-1 ${lineThroughClass}`}>
          <span className="capitalize font-medium">
            {orderDetail.order_detail_name}
          </span>
          <span className="text-xs capitalize text-gray-500">
            {orderDetail.product_items?.product_item_color}
          </span>
          <span className="text-xs text-gray-500">
            ({orderDetail.order_detail_size}) ×{orderDetail.order_detail_qty}
          </span>
        </div>

        {/* Show View button if there are returns */}
        {orderDetail.returns && orderDetail.returns.length > 0 && (
          <div className="flex gap-1">
            {orderDetail.returns.map((returnItem, returnIndex) => (
              <Button
                key={returnIndex}
                variant="outline"
                onClick={() => onViewReturn(orderDetail, returnItem)}
                className="text-xs"
              >
                View Return
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}