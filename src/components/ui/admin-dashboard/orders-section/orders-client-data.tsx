"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../carousel/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
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
import { OrderDetailProps, OrdersProps } from "@/lib/types/orders-types";
import { getStatusBadgeColor } from "@/lib/helper/get-order-status-badge-color";

export default function OrdersClientData({ orders }: OrdersClientDataProps) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Partial<OrdersProps> | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<OrderDetailProps | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Auto-refresh every 30s
  useEffect(() => {
    router.refresh();
    const interval = setInterval(() => {
      console.log("Orders data refreshed");
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);
  const totals = useMemo(() => {
    const counts = { 
      pending: 0, 
      processing: 0, 
      shipped: 0, 
      delivered: 0, 
      pending_return: 0, 
      returned: 0 
    };
  
    orders.forEach((order) => {
      const status = order.order_purchased_status?.toLowerCase();
  
      if (status && counts.hasOwnProperty(status)) {
        counts[status as keyof typeof counts]++;
      }
  
      // Pending returns (any order with unaccepted returns)
      const totalPendingQty = orders.reduce((sum, order) => {
        return (
          sum +
          order.order_details
            .filter((d) => d.is_returned && !d.return_accepted)
            .reduce((t, i) => t + (i.returned_qty ?? 0), 0)
        );
      }, 0);
  
      const totalReturnedQty = orders.reduce((sum, order) => {
        return (
          sum +
          order.order_details
            .filter((d) => d.is_returned && d.return_accepted)
            .reduce((t, i) => t + (i.returned_qty ?? 0), 0)
        );
      }, 0);
      
      counts.pending_return = totalPendingQty;
      counts.returned = totalReturnedQty;
    });
  
    return counts;
  }, [orders]);
  
  
  // Filter orders based on dropdown
  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") return orders;
  
    // If user filters by "returned"
    if (statusFilter === "Returned") {
      return orders.filter(
        (order) =>
          order.order_details.filter(o => !o.is_returned) &&
          order.order_details.some((d) => d.is_returned && d.return_accepted)
      );
    }

    // If user filters by "pending return"
    if (statusFilter === "Pending Return") {
      return orders.filter(
        (order) =>
          order.order_details.some((d) => d.is_returned && !d.return_accepted)
      );
    }
  
    // Default behavior for other statuses
    return orders.filter(
      (order) => order.order_purchased_status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [orders, statusFilter]);

  // Open edit modal
  const handleEdit = (order: Partial<OrdersProps>) => {
    setSelectedOrder(order);
    setEditStatus(order.order_purchased_status || "");
    setEditTracking(order.order_purchased_tracking_number || "");
    setIsDialogOpen(true);
  };

  // Open return details dialog
  const handleViewReturnDetails = (orderDetail: OrderDetailProps) => {
    // console.log("Selected Returned: ", orderDetail);
    setSelectedReturn(orderDetail);
    setIsReturnDialogOpen(true);
  };

  // Accept a return
  const handleAcceptReturnItem = async (order_detail_ID: number) => {
    return toast.promise(
      (async () => {
        const res = await fetchWithCsrf("/api/update-return-status", {
          method: "PATCH",
          body: JSON.stringify({
            order_detail_ID,
            return_accepted: true,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.errorMessage);
        return data;
      })(),
      {
        loading: "Accepting return...",
        success: (message) => {
          router.refresh();
          return message?.successMessage;
        },
        error: (e) => e.message || "Failed to accept return."
      }
    );
  };

  // Save changes (PATCH)
  const handleSave = async () => {
    if (!selectedOrder) return;

    const noChanges =
      editStatus === selectedOrder.order_purchased_status &&
      editTracking === (selectedOrder.order_purchased_tracking_number || "");

    if (noChanges) {
      toast.error("No changes detected. Please update at least one field.");
      return;
    }

    setIsSaving(true);

    try {
      await toast.promise(
        (async () => {
          const res = await fetchWithCsrf(UpdateOrdersStatusAndTrackingNumberURL, {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
        {Object.entries(totals).map(([status, count]) => (
          <Card
            key={status}
            className={`${getStatusBadgeColor(status)} border-border`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                Total {status === "pending_return" ? "Pending Return" : status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{count}</div>
            </CardContent>
          </Card>
        ))}
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
            <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
              {["All", "Pending", "Processing", "Shipped", "Delivered",  "Pending Return", "Returned"].map((s) => (
                <DropdownMenuRadioItem key={s} value={s}>
                  {s}
                </DropdownMenuRadioItem>
              ))}
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
                  <td className="px-4 py-2 font-medium">{order.order_purchased_number}</td>

                  <td className="px-4 py-2">
                    {order.address_order_purchased_delivery_address_IDToaddress?.recipient_first_name}{" "}
                    {order.address_order_purchased_delivery_address_IDToaddress?.recipient_last_name}
                  </td>

                  <td className="px-4 py-2 text-muted-foreground">
                    {order.order_details.map((d, index) => (
                      <div key={index} className="flex flex-col gap-1 border-b last:border-b-0 py-1">
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center flex-wrap gap-1 ${
                                d.is_returned && !d.return_accepted
                                ? "line-through decoration-red-800  decoration-1"
                                : d.is_returned && d.return_accepted ? "line-through decoration-red-800 decoration-2"
                                : "" 
                              }`}>
                            <span
                              className={`capitalize font-medium `}
                            >
                              {d.order_detail_name}
                            </span>
                            <span className="text-xs capitalize text-gray-500">
                              {d.product_items?.product_item_color}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({d.order_detail_size}) ×{d.order_detail_qty}
                            </span>
                          </div>

                          {d.is_returned && !d.return_accepted ? (
                            <Button
                              variant="outline"
                              onClick={() => handleViewReturnDetails(d)}
                              className="text-xs"
                            >
                              View
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </td>

                  <td className="px-4 py-2 font-medium">
                    ₱{order.payments?.payment_amount?.toLocaleString() ?? "0.00"}
                  </td>

                  <td className="px-4 py-2 space-x-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        order.order_purchased_status
                      )}`}>
                      {order.order_purchased_status === "returned" ? "all returned" : order.order_purchased_status}
                    </span>
                    
                    {order.order_purchased_status !== "returned" && (
                        <>
                          {/* 🔴 Pending Return Badge */}
                          {order.order_details.some((d) => d.is_returned && !d.return_accepted) && (
                            <div
                              className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"
                            >
                              <span>
                                (
                                  { order.order_details
                                  .filter((d) => d.is_returned && !d.return_accepted)
                                  .reduce((sum, d) => sum + (d.returned_qty ?? 0), 0)
                                  }
                                )
                              </span>
                              <span>pending return</span>
                            </div>
                          )}
                      
                          {/* 🟢 Returned Badge */}
                          {order.order_details.some((d) => d.is_returned && d.return_accepted) && (
                            <div
                              className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-red-800"
                            >
                              <span>
                                (
                                  { order.order_details
                                    .filter((d) => d.is_returned && d.return_accepted)
                                    .reduce((sum, d) => sum + (d.returned_qty ?? 0), 0)
                                  }
                                )
                              </span>
                              <span>returned</span>
                            </div>
                          )}
                        </>
                      )         
                    }
                  </td>

                  <td className="px-4 py-2">
                    {order.order_purchased_tracking_number || "-"}
                  </td>

                  <td className="px-4 py-2">
                    {OrderReceiptDateFormatter(order.order_purchased_date!.toString())}
                  </td>

                  <td className="px-4 py-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(order)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
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
                className="mt-1.5 w-full border rounded-md p-2 text-sm"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
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

      {/* ==== RETURN DETAILS DIALOG ==== */}
      <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Details</DialogTitle>
            <DialogDescription>
              View reason and status for this returned item.
            </DialogDescription>
          </DialogHeader>

          {selectedReturn && (
            <div className="space-y-3 py-3">
              <p className="capitalize">
                <strong>Product:</strong> {selectedReturn.order_detail_name}
              </p>
              <p>
                <strong>Returned Qty:</strong> {selectedReturn.returned_qty}
              </p>
              <p>
                <strong>Reason:</strong> {selectedReturn.return_reason}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedReturn.return_accepted ? (
                  <span className="text-green-600 font-semibold">Accepted</span>
                ) : (
                  <span className="text-red-600 font-semibold">Pending</span>
                )}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReturnDialogOpen(false)}>
              Close
            </Button>

            {!selectedReturn?.return_accepted && (
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => {
                  handleAcceptReturnItem(selectedReturn?.order_detail_ID ?? 0);
                  setIsReturnDialogOpen(false);
                }}>
                Accept Return
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
