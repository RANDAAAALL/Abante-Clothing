"use client";
import { useCheckoutModal } from "@/lib/store/checkout-items";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { CartItemsProps } from "@/lib/types/cart-items-types";
import { GenerateReceiptURL } from "@/lib/config";
import { PDFReceiptDataProps } from "@/lib/types/pdf-order-receipt-types";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { Button } from "../../button";

export default function OrderReceiptModal() {
  const {
    setClearComputeItems,
    setClearPayment,
    setResetSuccessfullPay,
    setClearSubmittedFormCheckoutFormData,
    setClearOrderPurchasedNumberAndDate,
    isSuccessfullPay,
    setClearItemsData,
    orderPurchasedNumberAndDate,
    submittedFormCheckoutFormData,
    computeItems,
    itemsData,
  } = useCheckoutModal();
  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState<boolean>(false);
  const [isDownloading, setDownloading] = useState<boolean>(false);

   // to prevent background scroll when dialog is open
   useEffect(() => { 
    document.body.style.overflow = isSuccessfullPay ? "hidden" : "auto"; 
  }, [isSuccessfullPay]);

  if (!isSuccessfullPay) return null;

  const handleReset = () => {
    setClearComputeItems();
    setClearPayment();
    setClearOrderPurchasedNumberAndDate();
    setResetSuccessfullPay();
    setClearSubmittedFormCheckoutFormData();
    setClearItemsData();
    toast("Thank you for purchasing.", {
      duration: 4000
    });
  };

  const handleDownloadReceipt = async () => {
    if (!submittedFormCheckoutFormData || !itemsData?.length) return null;

    // loading state for downloading a order receipt
    setDownloading(true);

    toast.promise(
      (async () => {
        // simulate loading
        // await new Promise(res => setTimeout(res, 3000));

        const receiptData: PDFReceiptDataProps = {
          orderNumber: orderPurchasedNumberAndDate?.orderPurchasedNumber ?? "",
          orderDate: orderPurchasedNumberAndDate?.orderPurchasedDate ?? "",
          recipientFirstName: submittedFormCheckoutFormData.recipientFirstName,
          recipientLastName: submittedFormCheckoutFormData.recipientLastName,
          companyName: submittedFormCheckoutFormData.companyName,
          addressName: submittedFormCheckoutFormData.addressName,
          apartmentName: submittedFormCheckoutFormData.apartmentName,
          cityName: submittedFormCheckoutFormData.cityName,
          regionName: submittedFormCheckoutFormData.regionName,
          country: submittedFormCheckoutFormData.country,
          postalCode: submittedFormCheckoutFormData.postalCode,
          phoneNumber: submittedFormCheckoutFormData.phoneNumber,
          addressType: submittedFormCheckoutFormData.addressType,
          paymentMethod: submittedFormCheckoutFormData.paymentMethod,
          totalAmount: computeItems?.overallPriceResult ?? 0,
          productDetails: itemsData.map(item => ({
            name: item.cart_item_name ?? "",
            color: item.cart_item_color ?? "",
            size: item.cart_item_size ?? "",
            qty: Number(item.cart_item_qty),
            image: item.cart_item_image ?? "",
          })),
        };

        const res = await fetchWithCsrf(`${GenerateReceiptURL}`, {
          method: "POST",
          body: JSON.stringify({receiptData}),
        });

        if(!res.ok) throw new Error("Failed to generate receipt.");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${orderPurchasedNumberAndDate?.orderPurchasedNumber}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      })(),
      {
        loading: "Downloading....",
        success: "Receipt downloaded successfully.",
        error: (e) => e?.message || "Failed to generate receipt.",
      }
    ).finally(() => {
      setDownloading(false);
      setClearComputeItems();
      setClearPayment();
      setClearOrderPurchasedNumberAndDate();
      setResetSuccessfullPay();
      setClearSubmittedFormCheckoutFormData();
      setClearItemsData();
      toast("Thank you for purchasing.", {
        duration: 4000
      });
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40">
        <div
          className={`bg-card-white-background max-h-[70vh] sm:max-h-[95vh] overflow-y-auto dark:bg-card-black-background rounded-xl shadow-2xl w-[500px] max-w-[90%] p-6 sm:p-8 space-y-6 transition-all duration-300`}>
          
          {/* header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Receipt
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Order No: <span className="font-semibold">{orderPurchasedNumberAndDate?.orderPurchasedNumber}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{orderPurchasedNumberAndDate?.orderPurchasedDate}</p>
          </div>

          <hr className="border-black dark:border-white border-t-2 mt-4 mb-4" />

          {submittedFormCheckoutFormData && (
            <>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {/* customer details */}
                <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                  Customer Details
                </h3>

                <div className="flex justify-between py-1">
                  <span className="font-medium">Recipient</span>
                  <span>
                    {submittedFormCheckoutFormData.recipientFirstName}{" "}
                    {submittedFormCheckoutFormData.recipientLastName}
                  </span>
                </div>

                {submittedFormCheckoutFormData.companyName && (
                  <div className="flex justify-between py-1">
                    <span className="font-medium">Company</span>
                    <span>{submittedFormCheckoutFormData.companyName}</span>
                  </div>
                )}

                <div className="flex justify-between py-1">
                  <span className="font-medium">Address</span>
                  <span className="text-right max-w-[60%] break-words">
                    {submittedFormCheckoutFormData.addressName}
                    {submittedFormCheckoutFormData.apartmentName
                      ? `, ${submittedFormCheckoutFormData.apartmentName}`
                      : ""}
                    , {submittedFormCheckoutFormData.cityName},{" "}
                    {submittedFormCheckoutFormData.regionName},{" "}
                    {submittedFormCheckoutFormData.country},{" "}
                    {submittedFormCheckoutFormData.postalCode}
                  </span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="font-medium">Phone</span>
                  <span>{submittedFormCheckoutFormData.phoneNumber}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="font-medium">Address Type</span>
                  <span className="capitalize">{submittedFormCheckoutFormData.addressType}</span>
                </div>
                <hr className="border-black dark:border-white border-t-2 my-4" />

                {/* order details */}
                <div>
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Order Details</h3>
                    <span onClick={() => setOrderDetailsOpen(!isOrderDetailsOpen)}>
                      {!isOrderDetailsOpen ? (
                        <ChevronDown className="cursor-pointer" />
                      ) : (
                        <ChevronUp className="cursor-pointer" />
                      )}
                    </span>
                  </div>

                  {/* show / hide items */}
                  <div className={`flex flex-col overflow-hidden transition-all duration-700 ease-in-out ${
                    isOrderDetailsOpen ? "max-h-[2000px]" : "max-h-0"}`}>
                    {itemsData?.map((item: CartItemsProps, index: number) => (
                      <div key={index} className="flex justify-between items-center py-3">
                        {/* tshirt image */}
                        <div className="h-20 w-30 relative">
                          <Image
                            className="object-contain"
                            src={item?.cart_item_image ?? "/images/png/tshirt_placeholder.png"}
                            priority
                            fill
                            alt="checkout-tshirt-image"/>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-right">{item?.cart_item_qty}x</span>
                          <span className="capitalize text-right">{item?.cart_item_color}</span>
                          <span className="capitalize">
                            {item?.cart_item_name} - {item?.cart_item_size}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-black dark:border-white border-t-2 my-4" />

                {/* payment details */}
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Payment Details</h3>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Payment Method</span>
                  <span className="capitalize">{submittedFormCheckoutFormData.paymentMethod}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="font-medium">Payment Status</span>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Paid</span>
                </div>

                <hr className="border-black dark:border-white border-t-2 my-4" />
                <div className="flex justify-between">
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ₱{computeItems?.overallPriceResult?.toLocaleString("en-Ph")}.00
                  </span>
                </div>
              </div>
            </>
          )}

          {/* footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Thank you for your purchase! 🎉 <br />
              A receipt email has also been sent to your inbox.
            </p>
          </div>

          {/* buttons */}
          <div className="flex flex-col space-y-2">
            <Button
              disabled={isDownloading}
              onClick={handleDownloadReceipt}
              className={`${isDownloading ? "cursor-not-allowed" : "cursor-pointer"} px-6 py-6 rounded-md bg-black text-white hover:bg-gray-900 transition`}>
              {isDownloading ? "Downloading..." : "Download Receipt"}
            </Button>

            <Button
              variant="outline"
              disabled={isDownloading}
              onClick={handleReset}
              className={`${isDownloading ? "cursor-not-allowed" : "cursor-pointer"} px-6 py-6 rounded-md border`}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
