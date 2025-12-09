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
import { useRouter } from "next/navigation";
import { OrderDetailProps, OrdersProps } from "@/lib/types/orders-types";
import { getStatusBadgeColor } from "@/lib/helper/get-order-status-badge-color";
import { useOrderCalculations } from "@/hooks/useOrderCalculations";
import { OrderStatusBadges } from "@/components/ui/status/order-status-badges";
import { ProductLine } from "@/components/ui/order/product-line";
import { ReturnDetailsDialog } from "../../modal/return-details-dialog";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../select";
import { ProductItem } from "@/lib/interface/order-history-dialog";
import { actionUpdateReturnStatus } from "@/lib/actions/handle-update-return-status";
import { actionUpdateOrderStatusAndTrackingNumber } from "@/lib/actions/handle-update-order-status-and-tracking-number";

export default function OrdersClientData({ orders }: OrdersClientDataProps) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Partial<OrdersProps> | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editTracking, setEditTracking] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<OrderDetailProps | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const { totals } = useOrderCalculations(orders);

  // Auto-refresh every 30s
  useEffect(() => {
    router.refresh();
    const interval = setInterval(() => {
      console.log("Orders data refreshed");
      router.refresh();
    }, 30000);
    return () => clearInterval(interval);
  }, [router]);

  // Filter orders based on dropdown AND search term
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // First apply status filter
    if (statusFilter === "Returned") {
      filtered = filtered.filter((order) =>
        order.order_details.some((d) => 
          d.returns?.some(r => r.is_returned === 1 && r.is_return_accepted === "Accepted")
        )
      );
    } else if (statusFilter === "Pending Return") {
      filtered = filtered.filter((order) =>
        order.order_details.some((d) => 
          d.returns?.some(r => r.is_returned === 1 && r.is_return_accepted === null)
        )
      );
    } else if (statusFilter !== "All") {
      filtered = filtered.filter(
        (order) =>
          order.order_purchased_status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Then apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((order) =>
        order.order_purchased_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [orders, statusFilter, searchTerm]);

  // Edit Modal Handlers
  const handleEdit = (order: Partial<OrdersProps>) => {
    setSelectedOrder(order);
    setEditStatus(order.order_purchased_status || "");
    setEditTracking(order.order_purchased_tracking_number || "");
    setIsDialogOpen(true);
  };

  // view Return Details 
  const handleViewReturnDetails = (orderDetail: OrderDetailProps, returnItem: NonNullable<ProductItem["returns"]>[0]) => {
    setSelectedReturn({
      ...orderDetail,
      returns: [returnItem]
    });
    setIsReturnDialogOpen(true);
  };

  // accept/Reject Return
  const handleAcceptOrRejectReturnItem = async (return_ID: number, isReturnAccepted: boolean) => {
    // console.log("Return ID: ", return_ID, isReturnAccepted );
    toast.promise(
      (async () => {
        const data = { return_ID, is_return_accepted: isReturnAccepted ? "Accepted" : "Rejected" };
        const res = await actionUpdateReturnStatus(data);
        if (res.status !== 200) throw new Error(`${res.errorMessage}`);

        return res;
      })(),
      {
        loading: isReturnAccepted ? "Accepting return..." : "Rejecting return...",
        success: (message) => {
          router.refresh();
          if("successMessage" in message && message.successMessage) {
            return message.successMessage;
          };

          return isReturnAccepted ? "Return accepted successfully." : "Return rejected successfully.";
        },
        error: (e) => e.message || (isReturnAccepted ? "Failed to accept return." : "Failed to reject return."),
      }
    );
  };

  // save changes
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
          const data = { 
            order_purchased_number: selectedOrder.order_purchased_number!,
            order_purchased_status: editStatus,
            order_purchased_tracking_number: editTracking,
          }
          const res = await actionUpdateOrderStatusAndTrackingNumber(data);
          if (res.status !== 200) throw new Error(`${res.errorMessage}`);
          return res;
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

  // clear search
  const handleClearSearch = () => {
    setSearchTerm("");
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
                Total {status === "pending_return" 
                      ? "Pending Return Quantity" 
                      : status === "returned" ? "Returned Quantity" 
                      : status}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ==== FILTERS ==== */}
      <div className="mt-6 mb-3 flex flex-col w-full sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="font-medium text-sm whitespace-nowrap">Order Status:</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-45.5 md:w-40 justify-between">
                {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="dark:bg-card-black-background">
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                {[
                  "All",
                  "Pending",
                  "Processing",
                  "Shipped",
                  "Delivered",
                  "Pending Return",
                  "Returned",
                ].map((s) => (
                  <DropdownMenuRadioItem key={s} value={s}>
                    {s}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by Order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} 
          {searchTerm && ` for "${searchTerm}"`}
          {statusFilter !== "All" && ` in ${statusFilter}`}
        </div>
      )}

      {/* ==== ORDERS TABLE ==== */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 dark:bg-card-black-background">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Order #</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Products</th>
              <th className="px-4 py-3 text-left font-semibold">Total</th>
              <th className="px-4 py-3 text-left font-semibold min-w-[160px]">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Tracking #</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                // Calculate return stats from the new returns table
                const allReturns = order.order_details.flatMap(d => d.returns || []);
                const totalReturnedAccepted = allReturns
                  .filter(r => r.is_return_accepted === "Accepted")
                  .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

                const totalReturnedRejected = allReturns
                  .filter(r => r.is_return_accepted === "Rejected")
                  .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);

                const pendingReturnCount = allReturns
                  .filter(r => r.is_return_accepted === null)
                  .reduce((sum, r) => sum + (r.returned_product_qty || 0), 0);
                
                const totalItems = order.order_details.reduce(
                  (sum, d) => sum + (d.order_detail_qty ?? 0),
                  0
                );
                const allReturned = totalReturnedAccepted === totalItems && totalItems > 0;

                return (
                  <tr key={order.order_purchased_number}>
                    <td className="px-4 py-2 font-medium">
                      {order.order_purchased_number}
                    </td>

                    <td className="px-4 py-2">
                      {
                        order.address_order_purchased_delivery_address_IDToaddress
                          ?.recipient_first_name
                      }{" "}
                      {
                        order.address_order_purchased_delivery_address_IDToaddress
                          ?.recipient_last_name
                      }
                    </td>

                    {/* ==== PRODUCTS ==== */}
                    <td className="px-4 py-2 text-muted-foreground">
                      {order.order_details.map((d, index) => (
                        <ProductLine
                          key={index}
                          orderDetail={d}
                          onViewReturn={handleViewReturnDetails}
                        />
                      ))}
                    </td>

                    <td className="px-4 py-2 font-medium">
                      ₱{order.payments?.payment_amount?.toLocaleString() ?? "0.00"}
                    </td>

                    {/* ==== STATUS BADGES ==== */}
                    <td className="px-4 py-3">
                      <div className="min-w-[160px]">
                        <OrderStatusBadges
                          orderStatus={order.order_purchased_status || ""}
                          totalReturnedAccepted={totalReturnedAccepted}
                          totalReturnedRejected={totalReturnedRejected}
                          pendingReturnCount={pendingReturnCount}
                          totalItems={totalItems}
                          allReturned={allReturned}
                        />
                      </div>
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
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-500">
                  {searchTerm || statusFilter !== "All" 
                    ? `No orders found${searchTerm ? ` for "${searchTerm}"` : ""}${statusFilter !== "All" ? ` in ${statusFilter}` : ""}.` 
                    : "No orders found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ==== EDIT DIALOG ==== */}
      <Dialog open={isDialogOpen} onOpenChange={!isSaving ? setIsDialogOpen : undefined}>
        <DialogContent className="dark:bg-card-black-background">
          <DialogHeader>
            <DialogTitle>Edit Order #{selectedOrder?.order_purchased_number}</DialogTitle>
            <DialogDescription>
              Update the status or tracking number of this order below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Status</Label>
              <Select
                disabled={isSaving}
                value={editStatus}
                onValueChange={setEditStatus}
>
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-card-black-background">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
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
      <ReturnDetailsDialog
        isOpen={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
        selectedReturn={selectedReturn}
        onAcceptOrReject={handleAcceptOrRejectReturnItem}
      />
    </div>
  );
}