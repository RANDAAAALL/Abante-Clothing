"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { GenerateReceiptURL } from "@/lib/config";
import { useOrderHistoryReceiptModal } from "@/lib/store/order-history";
import { PDFReceiptDataProps } from "@/lib/types/pdf-order-receipt-types";

export default function OrderHistoryReceiptModal() {
  const {
    isOpen,
    setCloseModal,
    orderHistoryReceiptData,
    orderPurchasedNumber,
    setClearOrderPurchasedNumber,
  } = useOrderHistoryReceiptModal();

  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [isDownloading, setDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const isTheSameOrderPurchasedNumber = orderHistoryReceiptData?.some(
    (order) => order?.orderNumber === orderPurchasedNumber
  );

  const orderItems = orderHistoryReceiptData?.filter(order => order.orderNumber === orderPurchasedNumber);

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
            productDetails: order.productDetails.map(prod => ({
              name: prod.name,
              color: prod.color,
              size: prod.size,
              qty: Number(prod.qty),
              image: prod.image ?? "",
            })),
          };

        const res = await fetch(`${GenerateReceiptURL}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({receiptData}),
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
      }, {
        duration: 5000
      }
    ).finally(() => {
      setDownloading(false);
      setCloseModal();
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
      <div className="bg-card-white-background max-h-[70vh] sm:max-h-[95vh] overflow-y-auto dark:bg-card-black-background rounded-xl shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 space-y-6 transition-all duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Order Receipt
          </h2>

          {orderHistoryReceiptData &&
            isTheSameOrderPurchasedNumber &&
            orderItems.map((item, index) => (
              <React.Fragment key={index}>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order No: <span className="font-semibold">{item.orderNumber}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.orderPurchasedDate
                    ? new Date(item.orderPurchasedDate).toLocaleString()
                    : "-"}
                </p>

                <hr className="border-black dark:border-white border-t-2 mt-4 mb-4" />

                {/* CUSTOMER DETAILS */}
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                    Customer Details
                  </h3>

                  <div className="flex justify-between py-1">
                    <span className="font-medium">Recipient</span>
                    <span>
                      {item.recipientFirstName}{" "}
                      {item.recipientLastName}
                    </span>
                  </div>

                  {item.companyName && (
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Company</span>
                      <span>{item.companyName}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-1">
                    <span className="font-medium">Address</span>
                    <span className="text-right max-w-[60%] break-words">
                      {item.addressName}
                      {item.apartmentName ? `, ${item.apartmentName}` : ""},{" "}
                      {item.cityName}, {item.regionName}, {item.country},{" "}
                      {item.postalCode}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="font-medium">Phone</span>
                    <span>{item.phoneNumber}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="font-medium">Address Type</span>
                    <span className="capitalize">{item.addressType}</span>
                  </div>

                  <hr className="border-black dark:border-white border-t-2 my-4" />

                  {/* ORDER DETAILS */}
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        Order Details
                      </h3>
                      <span
                        onClick={() => setOrderDetailsOpen(!isOrderDetailsOpen)}
                      >
                        {!isOrderDetailsOpen ? (
                          <ChevronDown className="cursor-pointer" />
                        ) : (
                          <ChevronUp className="cursor-pointer" />
                        )}
                      </span>
                    </div>

                    <div
                      className={`flex flex-col overflow-hidden transition-all duration-700 ease-in-out ${
                        isOrderDetailsOpen ? "max-h-[2000px]" : "max-h-0"
                      }`}
                    >
                      {item.productDetails.map((prod, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center py-3"
                        >
                          <div className="h-20 w-30 relative">
                            <Image
                              className="object-contain"
                              src={
                                prod.image ??
                                "/images/png/tshirt_placeholder.png"
                              }
                              priority
                              fill
                              alt="checkout-tshirt-image"
                            />
                          </div>

                          <div className="flex flex-col">
                            <span className="text-right">{prod.qty}x</span>
                            <span className="capitalize text-right">
                              {prod.color}
                            </span>
                            <span className="capitalize">
                              {prod.name} - {prod.size}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-black dark:border-white border-t-2 my-4" />

                  {/* PAYMENT DETAILS */}
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Payment Details
                  </h3>

                  <div className="flex justify-between py-1">
                    <span className="font-medium">Payment Method</span>
                    <span className="capitalize">{item.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="font-medium">Payment Status</span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      Paid
                    </span>
                  </div>

                  <hr className="border-black dark:border-white border-t-2 my-4" />

                  <div className="flex justify-between">
                    <span className="font-semibold text-lg text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary">
                      ₱{item.totalAmount.toLocaleString("en-Ph")}.00
                    </span>
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4 mt-6">
                  <button
                    disabled={isDownloading}
                    onClick={handleReset}
                    className={`${
                      isDownloading
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } px-6 w-full md:w-auto py-2.5 rounded-md border border-gray-400 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}>
                    Close
                  </button>
                  <button
                    disabled={isDownloading}
                    onClick={handleDownloadReceipt}
                    className={`${
                      isDownloading
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    } px-6 py-2.5 rounded-md bg-card-black-background text-white dark:bg-card-white-background dark:text-black hover:opacity-90 transition-all`}>
                    {isDownloading ? "Downloading..." : "Download Receipt"}
                  </button>
                </div>
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}
