"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { GenerateReceiptURL } from "@/lib/config";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { PDFReceiptDataProps } from "@/lib/types/pdf-order-receipt-types";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { OrderReceiptDateFormatter } from "@/lib/helper/order-receipt-date-formatter";

export default function OrderHistoryReceiptDialog() {
  const {
    isOpen,
    setCloseModal,
    orderHistoryReceiptData,
    orderPurchasedNumber,
    setClearOrderPurchasedNumber,
  } = useOrderHistoryReceiptModal();

  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [isDownloading, setDownloading] = useState(false);

  const isTheSameOrderPurchasedNumber = orderHistoryReceiptData?.some(
    (order) => order?.orderNumber === orderPurchasedNumber
  );

  const orderItems = orderHistoryReceiptData?.filter(
    (order) => order.orderNumber === orderPurchasedNumber
  );

  const handleReset = () => {
    setCloseModal();
    setClearOrderPurchasedNumber();
  };

  const handleDownloadReceipt = async () => {
    if (!orderItems || !orderPurchasedNumber) return null;
    setDownloading(true);

    toast.promise(
      (async () => {
        const order = orderItems[0];
        const receiptData: PDFReceiptDataProps = {
          orderNumber: order.orderNumber,
          orderDate: new Date(order.orderPurchasedDate).toLocaleString(),
          recipientFirstName: order.recipientFirstName ?? "",
          recipientLastName: order.recipientLastName ?? "",
          companyName: order.companyName,
          addressName: order.addressName ?? "",
          apartmentName: order.apartmentName,
          cityName: order.cityName ?? "",
          regionName: order.regionName ?? "",
          country: order.country,
          postalCode: order.postalCode ?? "",
          phoneNumber: order.phoneNumber ?? "",
          addressType: order.addressType,
          paymentMethod: order.paymentMethod,
          totalAmount: order.totalAmount,
          productDetails: order.productDetails.map((prod) => ({
            name: prod.name,
            color: prod.color,
            size: prod.size,
            qty: Number(prod.qty),
            image: prod.image ?? "",
          })),
        };

        const res = await fetchWithCsrf(`${GenerateReceiptURL}`, {
          method: "POST",
          body: JSON.stringify({ receiptData }),
        });

        if (!res.ok) throw new Error("Failed to generate receipt.");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${order.orderNumber}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      })(),
      {
        loading: "Downloading....",
        success: "Receipt downloaded successfully.",
        error: (e) => e?.message || "Failed to generate receipt.",
      },
      { duration: 5000 }
    ).finally(() => {
      setDownloading(false);
      setCloseModal();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto dark:bg-card-black-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Order Receipt
          </DialogTitle>
        </DialogHeader>

        {orderHistoryReceiptData &&
          isTheSameOrderPurchasedNumber &&
          orderItems.map((item, index) => (
            <React.Fragment key={index}>
              <div className="space-y-4 text-gray-800 dark:text-gray-200">
                <div className="text-center space-y-1">
                  <p className="text-sm">
                    Order #:{" "}
                    <span className="font-semibold">{item.orderNumber}</span>
                  </p>
                  <p className="text-sm">
                    {item.orderPurchasedDate
                      ? OrderReceiptDateFormatter(item.orderPurchasedDate as string)
                      : "-"}
                  </p>
                </div>

                <hr className="border-t-2 border-black dark:border-white my-4" />

                {/* Customer Details */}
                <section className="text-sm space-y-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Customer Details
                  </h3>
                  <div className="flex justify-between py-1">
                    <span>Recipient</span>
                    <span>
                      {item.recipientFirstName} {item.recipientLastName}
                    </span>
                  </div>

                  {item.companyName && (
                    <div className="flex justify-between py-1">
                      <span>Company</span>
                      <span>{item.companyName}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1">
                    <span>Address</span>
                    <span className="text-right max-w-[60%] break-words">
                      {item.addressName}
                      {item.apartmentName ? `, ${item.apartmentName}` : ""},{" "}
                      {item.cityName}, {item.regionName}, {item.country},{" "}
                      {item.postalCode}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Phone</span>
                    <span>{item.phoneNumber}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Address Type</span>
                    <span className="capitalize">{item.addressType}</span>
                  </div>
                </section>

                <hr className="border-t-2 border-black dark:border-white my-4" />

                {/* Order Details */}
                <section>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Order Details</h3>
                    <button
                      onClick={() =>
                        setOrderDetailsOpen(!isOrderDetailsOpen)
                      }
                      className="p-1"
                    >
                      {isOrderDetailsOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div
                    className={`transition-all overflow-hidden ${
                      isOrderDetailsOpen ? "max-h-[1000px]" : "max-h-0"
                    }`}
                  >
                    {item.productDetails.map((prod, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-3"
                      >
                        <div className="relative h-20 w-20">
                          <Image
                            className="object-contain rounded-md"
                            src={
                              prod.image ??
                              "/images/png/tshirt_placeholder.png"
                            }
                            alt="product"
                            fill
                          />
                        </div>
                        <div className="flex flex-col items-end">
                          <span>{prod.qty}x</span>
                          <span className="capitalize">{prod.color}</span>
                          <span className="capitalize">
                            {prod.name} - {prod.size}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <hr className="border-t-2 border-black dark:border-white my-4" />

                {/* Payment Details */}
                <section className="text-sm space-y-1">
                  <h3 className="font-semibold text-lg mb-2">
                    Payment Details
                  </h3>
                  <div className="flex justify-between py-1">
                    <span>Payment Method</span>
                    <span className="capitalize">{item.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span>Payment Status</span>
                    <span className="text-green-600 font-semibold">Paid</span>
                  </div>

                  <hr className="border-t-2 border-black dark:border-white my-4" />

                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ₱{item.totalAmount.toLocaleString("en-PH")}.00
                    </span>
                  </div>
                </section>
              </div>

              <DialogFooter className="mt-6 flex flex-col sm:flex-row">
                <button
                  disabled={isDownloading}
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-gray-400 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Close
                </button>
                <button
                  disabled={isDownloading}
                  onClick={handleDownloadReceipt}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-black text-white hover:opacity-90 transition-all disabled:opacity-70"
                >
                  {isDownloading ? "Downloading..." : "Download Receipt"}
                </button>
              </DialogFooter>
            </React.Fragment>
          ))}
      </DialogContent>
    </Dialog>
  );
}
