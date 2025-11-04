"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../carousel/card";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { Button } from "../../button";
import { StatusProductsProps } from "@/lib/types/status-products-types";
import { getDiscountedPrice } from "@/lib/helper/get-discounted-price";
import EditUploadProductContent from "./edit-upload-product-content";
import { OrderReceiptDateFormatter } from "@/lib/helper/order-receipt-date-formatter";

export default function UploadProductClientData({
  products,
}: {
  products: StatusProductsProps[];
}) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => p.product_item_status === filter);
  }, [filter, products]);

  const totalToBeDeploy = products.filter(
    (p) => p.product_item_status === "to be deploy"
  ).length;
  const totalAvailable = products.filter(
    (p) => p.product_item_status === "available"
  ).length;
  const totalNotAvailable = products.filter(
    (p) => p.product_item_status === "not available"
  ).length;

  return (
    <div>
      {/* === Summary Cards === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="dark:bg-card-black-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total To Be Deploy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalToBeDeploy}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card-black-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAvailable}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-card-black-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Not Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalNotAvailable}</p>
          </CardContent>
        </Card>
      </div>

      {/* === Filter Section === */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-6">
        <span className="text-lg font-semibold">Product Status:</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-between">
              {filter === "to be deploy"
                ? "To Be Deploy"
                : filter === "available"
                ? "Available"
                : filter === "not available"
                ? "Not Available"
                : "All"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="to be deploy">To Be Deploy</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="available">Available</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="not available">Not Available</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* === Products Display === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <Card key={p.product_item_ID} className="dark:bg-card-black-background py-2 gap-0 overflow-hidden hover:shadow-md transition">
             <div className="flex flex-col space-y-1 md:flex-row px-4">

                <div className="relative h-48 w-full">
                    <Image
                    src={p.product_item_image ?? "/images/png/tshirt_placeholder.png"}
                    alt={p.product_item_name ?? ""}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                    {p.product_item_back_image && (
                    <div className="relative h-48 w-full">
                    <Image
                        src={p.product_item_back_image}
                        alt={`${p.product_item_name} back`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    </div>
                    )}
             </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg capitalize">{p.product_item_name}</h3>

                  {/* Edit Button */}
                  <EditUploadProductContent product={p} /> 
                </div>

                {/* Details Section */}
                <p className="text-sm text-gray-500 capitalize">
                  Status: {p.product_item_status ?? "Unknown"}
                </p>

                <div className="flex items-center space-x-1">
                    <span className={`${p.product_item_discount ?? 0 > 0 ? "line-through" : ""} font-bold text-lg`}>
                     ₱{Number(p.product_item_price).toLocaleString()}
                    </span>
                    {p.product_item_discount ? (
                        <>
                        <span className="text-lg">-</span>
                        <span className="text-lg font-bold">₱{getDiscountedPrice(Number(p.product_item_price), p.product_item_discount)}</span>
                        <span className="text-sm font-medium">-{p.product_item_discount}%</span>
                        </>
                    ) : null}
                </div>

                <div className="text-sm space-y-1">
                  <p><span className="font-semibold">Color:</span> {p.product_item_color ?? "N/A"}</p>
                  <p><span className="font-semibold">Size:</span> {p.product_item_size ?? "N/A"}</p>
                  <p><span className="font-semibold">Type:</span> {p.product_item_type}</p>
                  <p><span className="font-semibold">Fit:</span> {p.product_item_fit ?? "N/A"}</p>
                  <p><span className="font-semibold">Material:</span> {p.product_item_material ?? "N/A"}</p>
                  <p><span className="font-semibold">Construction:</span> {p.product_item_construction ?? "N/A"}</p>
                  <p><span className="font-semibold">Design Features:</span> {p.product_item_design_features ?? "N/A"}</p>
                  <p><span className="font-semibold">Stock:</span> {p.product_item_stock ?? 0}</p>
                  <p><span className="font-semibold">
                    Uploaded Date:{" "}
                  </span>
                    {p.product_item_displayDate
                      ? OrderReceiptDateFormatter(p.product_item_displayDate)
                      : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">No products found.</p>
        )}
      </div>
    </div>
  );
}
