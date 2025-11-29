"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderReceiptDateFormatter } from "@/lib/helper/order-receipt-date-formatter";
import Image from "next/image";
import { ReturnDetailsDialogProps } from "@/lib/interface/return-details-dialog";

export function ReturnDetailsDialog({
  isOpen,
  onClose,
  selectedReturn,
  onAcceptOrReject,
}: ReturnDetailsDialogProps) {
  if (!selectedReturn?.returns?.[0]) return null;

  const returnItem = selectedReturn.returns[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-card-black-background max-w-md">
        <DialogHeader>
          <DialogTitle>Return Details</DialogTitle>
          <DialogDescription>
            View reason and status for this returned item.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-black dark:border-white p-4 space-y-4">
          {/* Product Information */}
          <div className="flex items-center space-x-3">
            {returnItem.returned_product_image?.[0] && (
              <div className="relative w-14 h-14">
                <Image
                  src={returnItem.returned_product_image[0]}
                  alt={selectedReturn.order_detail_name as string}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}

            <h3 className="capitalize font-semibold text-gray-900 dark:text-gray-100 text-base">
              {returnItem.returned_product_name}
            </h3>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="font-medium">Size:</span>
              <span>{returnItem.returned_product_size}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Color:</span>
              <span className="capitalize">
                {returnItem.returned_product_color}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Quantity:</span>
              <span>{returnItem.returned_product_qty}</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-medium">Price:</span>
              <span>₱{returnItem.returned_product_price}</span>
            </div>
          </div>

          {/* Return Details */}
          <div className="space-y-3 pt-3 border-t border-black dark:border-white">
            <div>
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Reason:
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {returnItem.returned_product_reason}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Status:
              </span>
              {returnItem.is_return_accepted === "Accepted" ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  ✓ Accepted
                </span>
              ) : returnItem.is_return_accepted === "Rejected" ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  ✗ Rejected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                  ⏳ Pending Request
                </span>
              )}
            </div>

            {/* Return Dates */}
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">Return Requested:</span>
                <p>
                  {returnItem.request_return_date
                    ? OrderReceiptDateFormatter(
                        returnItem.request_return_date as string
                      )
                    : "Date Not available"}
                </p>
              </div>
              {returnItem.returned_date && (
                <div>
                  <span className="font-medium">
                    {returnItem.is_return_accepted === "Rejected"
                      ? "Rejected:"
                      : "Returned:"}
                  </span>
                  <p>
                    {OrderReceiptDateFormatter(
                      returnItem.returned_date as string
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          {returnItem.is_return_accepted === null && (
            <>
              <Button
                variant="outline"
                className="bg-red-600 text-white hover:bg-red-700 border-red-600"
                onClick={() => {
                  onAcceptOrReject(returnItem.return_ID, false);
                  onClose();
                }}
              >
                Reject Return
              </Button>

              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  onAcceptOrReject(returnItem.return_ID, true);
                  onClose();
                }}
              >
                Accept Return
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
