"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../carousel/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OrdersClientDataProps } from "@/lib/interface/orders-client-data";
import { OrderReceiptDateFormatter } from "@/lib/helper/order-receipt-date-formatter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { UpdateOrdersStatusAndTrackingNumberURL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { OrdersProps } from "@/lib/types/orders-types";
import { getStatusBadgeColor } from "@/lib/helper/get-order-status-badge-color";

export default function OrdersClientData({ orders }: OrdersClientDataProps) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Partial<OrdersProps> | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.refresh(); 
    const interval = setInterval(() => {
      console.log("orders useEffect triggered!");
      router.refresh()
    }, 30000); // interval every 30s
    return () => clearInterval(interval);
  }, [router]);

  const totals = useMemo(() => {
    const counts = { pending: 0, processing: 0, shipped: 0, delivered: 0 };
    orders.forEach((order) => {
      const status = order.order_purchased_status?.toLowerCase();
      if (status && status in counts) counts[status as keyof typeof counts]++;
    });
    return counts;
  }, [orders]);

  // filter orders based on selected dropdown value
  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
    return orders.filter(
      (order) => order.order_purchased_status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [orders, statusFilter]);

  // handle edit button
  const handleEdit = (order: Partial<OrdersProps>) => {
    // console.log("current selected order: ", order);
    setSelectedOrder(order);
    setEditStatus(order.order_purchased_status || "");
    setEditTracking(order.order_purchased_tracking_number || "");
    setIsDialogOpen(true);
  };

// save changes
const handleSave = async () => {
  if (!selectedOrder) return;

  // validation check if there is no any changes
  const noChanges =
    editStatus === selectedOrder.order_purchased_status &&
    editTracking === (selectedOrder.order_purchased_tracking_number || "");

  if (noChanges) {
    toast.error("No changes detected. Please update at least one.");
    return;
  }

  setIsSaving(true);

  try {
    await toast.promise(
      (async () => {
        const res = await fetchWithCsrf(`${UpdateOrdersStatusAndTrackingNumberURL}`, {
          method: "PATCH",
          body: JSON.stringify({
            order_purchased_number: selectedOrder.order_purchased_number,
            order_purchased_status: editStatus,
            order_purchased_tracking_number: editTracking,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(`${data?.errorMessage}`);

        return data;
      })(),
      {
        loading: "Saving...",
        success: (message) => {
          router.refresh();
          setIsDialogOpen(false);
          setSelectedOrder(null);
          return message?.successMessage || "Order updated successfully.";
        },
        error: (e) => e?.message || "Failed to update order.",
      }
    );
  } finally {
    setIsSaving(false);
  }
};


  return (
    <div className="mt-8">
      
      {/* ==== STATUS CARDS ==== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
        <Card className="bg-yellow-100 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              Total Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-800">
              {totals.pending}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-100 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              {totals.processing}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-100 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Total Shipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {totals.shipped}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-100 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {totals.delivered}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ==== FILTER DROPDOWN ==== */}
      <div className="mt-6 mb-3 flex items-center gap-4">
        <label className="font-medium text-sm">Order Status:</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-40 justify-between">
              {statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={statusFilter}
              onValueChange={setStatusFilter}>
              <DropdownMenuRadioItem value="All">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Pending">
                Pending
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Processing">
                Processing
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Shipped">
                Shipped
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Delivered">
                Delivered
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ==== ORDERS TABLE ==== */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 dark:bg-card-black-background">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Order #</th>
              <th className="px-4 py-2 text-left font-semibold">Customer</th>
              <th className="px-4 py-2 text-left font-semibold">Products</th>
              <th className="px-4 py-2 text-left font-semibold">Total</th>
              <th className="px-4 py-2 text-left font-semibold">Status</th>
              <th className="px-4 py-2 text-left font-semibold">Tracking #</th>
              <th className="px-4 py-2 text-left font-semibold">Date</th>
              <th className="px-4 py-2 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.order_purchased_number}>
                  <td className="px-4 py-2 font-medium">
                    {order.order_purchased_number}
                  </td>

                  <td className="px-4 py-2">
                    {order.address_order_purchased_delivery_address_IDToaddress
                      ?.recipient_first_name}{" "}
                    {
                      order.address_order_purchased_delivery_address_IDToaddress
                        ?.recipient_last_name
                    }
                  </td>

                  <td className="px-4 py-2 text-muted-foreground">
                    {order.order_details.map((d, index) => (
                      <div key={index} className="flex gap-1 items-center">
                        <span className="capitalize">{d.order_detail_name}</span>
                        <span className="text-sm capitalize">
                          {d.product_items?.product_item_color}
                        </span>
                        <span className="text-sm">({d.order_detail_size})</span>
                        <span className="text-sm">x{d.order_detail_qty}</span>
                      </div>
                    ))}
                  </td>

                  <td className="px-4 py-2 font-medium">
                    ₱{order.payments?.payment_amount?.toLocaleString() ?? "0.00"}
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        order.order_purchased_status
                      )}`}
                    >
                      {order.order_purchased_status}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    {order.order_purchased_tracking_number || "-"}
                  </td>

                  <td className="px-4 py-2">
                    {OrderReceiptDateFormatter(
                      order.order_purchased_date!.toString()
                    )}
                  </td>

                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(order)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-500">
                  No orders found for this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==== EDIT DIALOG ==== */}
      <Dialog open={isDialogOpen} onOpenChange={!isSaving ? setIsDialogOpen : undefined}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order #{selectedOrder?.order_purchased_number}</DialogTitle>
            <DialogDescription>
              Update the status or tracking number of this order below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Status</Label>
              <select
                disabled={isSaving}
                className="
                mt-1.5
                w-full border rounded-md p-2 text-sm
                bg-background text-foreground
                border-border
                focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring
                disabled:opacity-60 disabled:cursor-not-allowed
                dark:bg-[#1a1a1a] dark:text-white dark:border-[#333]"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <Label>Tracking Number</Label>
              <Input
                disabled={isSaving}
                className="mt-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                value={editTracking}
                onChange={(e) => setEditTracking(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
