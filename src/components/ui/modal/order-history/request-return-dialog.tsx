"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ReturnRequestDialogProps, ProductItem } from "@/lib/interface/order-history-dialog";
import toast from "react-hot-toast";
import { RequestReturnURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import CustomerFeedbackRating from "../../customer-feedback-rating";
import { useProductStatus } from "@/hooks/useProductStatus";
import { SelectAllButton } from "../../product/select-all-button";
import { ProductCard } from "../../product/product-card";
import { QuantitySelector } from "../../product/quantity-selector";

export default function ReturnRequestDialog({ isOpen, onClose, order, onUpdate }: ReturnRequestDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [returnReasons, setReturnReasons] = useState<{ [key: string]: string }>({});
  const [returnQuantities, setReturnQuantities] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localProducts, setLocalProducts] = useState<ProductItem[]>([]);
  const [updatedRatings, setUpdatedRatings] = useState<{ [key: string]: number }>({});

  const { getReturnStatus } = useProductStatus();

  // Sync products from props to local state when they change
  useEffect(() => {
    if (order?.products) {
      setLocalProducts(order.products);
    }
  }, [order?.products]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProducts([]);
      setReturnReasons({});
      setReturnQuantities({});
      setIsSubmitting(false);
      setUpdatedRatings({});
    }
  }, [isOpen]);

  const toggleProductSelection = (id: string) => {
    const product = localProducts.find(p => String(p.order_detail_ID) === id);
    
    if (!product) return;

    const { isReturned } = getReturnStatus(product);
    const isReceived = !!product.feedback_rating;
    
    // Dont allow selection if product is already received or has pending/accepted return
    if (isReceived) {
      toast.error("This product has been received and cannot be returned.");
      return;
    }

    if (isReturned) {
      toast.error("This product already has a return request.");
      return;
    }

    setSelectedProducts((prev) => {
      const isCurrentlySelected = prev.includes(id);
      
      if (isCurrentlySelected) {
        // If unselecting, remove the quantity and reason
        setReturnQuantities(prevQuantities => {
          const newQuantities = { ...prevQuantities };
          delete newQuantities[id];
          return newQuantities;
        });
        setReturnReasons(prevReasons => {
          const newReasons = { ...prevReasons };
          delete newReasons[id];
          return newReasons;
        });
        
        return prev.filter((p) => p !== id);
      } else {
        // If selecting, initialize with default quantity 1
        setReturnQuantities(prev => ({ ...prev, [id]: 1 }));
        return [...prev, id];
      }
    });
  };

  const handleReasonChange = (id: string, reason: string) => {
    setReturnReasons((prev) => ({ ...prev, [id]: reason }));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    const product = localProducts.find(p => String(p.order_detail_ID) === id);
    const maxQty = product?.qty || 1;
    
    if (quantity < 1) quantity = 1;
    if (quantity > maxQty) quantity = maxQty;
    
    setReturnQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  // Add Select All functionality
  const handleSelectAll = () => {
    const availableProducts = localProducts
      .filter(product => {
        const { isReturned } = getReturnStatus(product);
        const isReceived = !!product.feedback_rating;
        return !isReturned && !isReceived;
      })
      .map(product => String(product.order_detail_ID));
    
    setSelectedProducts(availableProducts);
    
    // Initialize all selected products with quantity 1
    const initialQuantities: { [key: string]: number } = {};
    availableProducts.forEach(id => {
      initialQuantities[id] = 1;
    });
    setReturnQuantities(initialQuantities);
  };

  const handleDeselectAll = () => {
    // Reset all quantities and reasons when deselecting all
    setReturnQuantities({});
    setReturnReasons({});
    setSelectedProducts([]);
  };

  const handleRatingChange = async (id: string, value: number) => {
    try {
      setUpdatedRatings(prev => ({ ...prev, [id]: value }));
      setLocalProducts(prev => prev.map(product => 
        String(product.order_detail_ID) === id 
          ? { ...product, feedback_rating: value }
          : product
      ));
      toast.success("Rating updated successfully!");
    } catch (error) {
      setUpdatedRatings(prev => {
        const newRatings = { ...prev };
        delete newRatings[id];
        return newRatings;
      });
      toast.error("Failed to update rating");
    }
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to return.");
      return;
    }

    const productsWithoutReason = selectedProducts.filter((id) => !returnReasons[id]?.trim());
    if (productsWithoutReason.length > 0) {
      toast.error("Please provide a reason for all selected products.");
      return;
    }

    const productsWithoutQuantity = selectedProducts.filter((id) => !returnQuantities[id]);
    if (productsWithoutQuantity.length > 0) {
      toast.error("Please set quantity for all selected products.");
      return;
    }

    setIsSubmitting(true);

    const originalProducts = [...localProducts];

    // ✅ OPTIMISTIC UPDATE: Update local state immediately
    const updatedProducts = localProducts.map(product => {
      if (selectedProducts.includes(String(product.order_detail_ID))) {
        return {
          ...product,
          returns: [{
            return_ID: Date.now(), // temporary ID for optimistic update
            order_detail_ID: product.order_detail_ID,
            is_returned: 1,
            returned_product_name: product.name,
            returned_product_price: null,
            returned_product_color: product.color,
            returned_product_qty: returnQuantities[String(product.order_detail_ID)] || 1,
            returned_product_size: product.size,
            returned_product_image: [product.image],
            returned_product_reason: returnReasons[String(product.order_detail_ID)] || "",
            request_return_date: new Date().toISOString(),
            returned_date: null,
            is_return_accepted: null // Set to null for pending state
          }]
        };
      }
      return product;
    });

    setLocalProducts(updatedProducts);

    try {
      const returnData = selectedProducts.map((order_detail_ID) => {
        const product = order?.products?.find(p => 
          String(p.order_detail_ID) === order_detail_ID
        );

        return {
          order_detail_ID,
          returned_product_name: product?.name ?? "",
          returned_product_qty: returnQuantities[order_detail_ID] || 1,
          returned_product_size: product?.size ?? "",
          returned_product_color: product?.color ?? "",
          returned_product_price: product?.price ?? 0,
          returned_product_image: product?.image ?? "",
          returned_product_reason: returnReasons[order_detail_ID],
        }
      });

      await toast.promise(
        (async () => {
          const res = await fetchWithCsrf(`${RequestReturnURL}`, {
            method: "POST",
            body: JSON.stringify({ returnData }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data?.errorMessage);
          return data;
        })(),
        {
          loading: "Submitting return request...",
          success: (message) => {
            return message?.successMessage;
          },
          error: (e) => {
            setLocalProducts(originalProducts);
            return e?.message || "Failed to submit return request.";
          },
        }, {
          duration: 5000
        }
      );

      setSelectedProducts([]);
      setReturnReasons({});
      setReturnQuantities({});
      onUpdate?.();

    } catch (error) {
      // Error is already handled in toast.promise
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if any products can be returned (not already returned and not received)
  const hasProductsWithoutReturn = localProducts.some(
    (product) => {
      const { isReturned } = getReturnStatus(product);
      const isReceived = !!product.feedback_rating;
      return !isReturned && !isReceived;
    }
  );

  const availableProductsCount = localProducts.filter(
    product => {
      const { isReturned } = getReturnStatus(product);
      const isReceived = !!product.feedback_rating;
      return !isReturned && !isReceived;
    }
  ).length;

  const isAllSelected = selectedProducts.length === availableProductsCount && availableProductsCount > 0;

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md dark:bg-card-black-background">
        <DialogHeader>
          <DialogTitle>
            {hasProductsWithoutReturn 
              ? "Request Return Item(s)" 
              : "No Request Returns Available"}
          </DialogTitle>
          <DialogDescription>
            {hasProductsWithoutReturn 
              ? "Select which product(s) from your order you would like to return."
              : "All products in this order have been received, returned, or have pending requests."
            }
          </DialogDescription>
        </DialogHeader>

        {/* Select All Button */}
        {hasProductsWithoutReturn && (
          <SelectAllButton
            selectedCount={selectedProducts.length}
            totalCount={availableProductsCount}
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}

        <div className="space-y-3 mt-3 max-h-64 overflow-y-auto pr-1">
          {localProducts.map((product) => {
            const id = `${product.order_detail_ID}`;
            const isSelected = selectedProducts.includes(id);
            const isReceived = !!product.feedback_rating;
            const returnStatus = getReturnStatus(product);
            const canSelect = !returnStatus.isReturned && !isReceived;

            // Determine border color and status based on product state
            let borderColor = "border-gray-300 dark:border-gray-400";
            if (isReceived) {
              borderColor = "border-green-500 bg-green-50 dark:bg-green-900/20";
            } else if (returnStatus.isReturnAccepted) {
              borderColor = "border-green-500 bg-green-50 dark:bg-green-900/20";
            } else if (returnStatus.isReturnRejected) {
              borderColor = "border-red-500 bg-red-50 dark:bg-red-900/20";
            } else if (returnStatus.hasPendingReturn) {
              borderColor = "border-orange-500 bg-orange-50 dark:bg-orange-900/20";
            } else if (isSelected) {
              borderColor = "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
            }

            return (
              <ProductCard
                key={id}
                product={product}
                returnStatus={returnStatus}
                isSelected={isSelected}
                canSelect={canSelect}
                onToggleSelection={toggleProductSelection}
                borderColor={borderColor}
              >
                {/* Return Details - Show for selected or pending/accepted returns */}
                {(isSelected || returnStatus.isReturned) && !isReceived && (
                  <div className="mt-2 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    {!returnStatus.isReturned ? (
                      <>
                        {/* Quantity Selector */}
                        <QuantitySelector
                          quantity={returnQuantities[id] || 1}
                          max={product.qty || 1}
                          onQuantityChange={(quantity) => handleQuantityChange(id, quantity)}
                          label="Return Quantity:"
                        />

                        {/* Reason Input */}
                        <div>
                          <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Reason:</label>
                          <textarea
                            placeholder="Why are you returning this product?"
                            className="w-full border rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={2}
                            value={returnReasons[id] || ""}
                            onChange={(e) => handleReasonChange(id, e.target.value)}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        {returnStatus.latestReturn?.returned_product_reason && (
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            Return reason: &quot;{returnStatus.latestReturn.returned_product_reason}&quot;
                          </p>
                        )}
                        {returnStatus.latestReturn?.returned_product_qty && (
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            Returned quantity: {returnStatus.latestReturn.returned_product_qty}
                          </p>
                        )}
                        {returnStatus.hasPendingReturn && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                            Waiting for approval
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Received product display */}
                {isReceived && (
                  <div className="mt-2">
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                      This product has been received
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <label className="text-xs text-gray-600 dark:text-gray-400">
                        Your Rating:
                      </label>
                      <CustomerFeedbackRating
                        rating={updatedRatings[id] ?? product.feedback_rating ?? 0}
                        max={5}
                        onChange={(value) => handleRatingChange(id, value)}
                      />
                    </div>
                    {product.feedback_comment && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                        Feedback: &quot;{product.feedback_comment}&quot;
                      </p>
                    )}
                  </div>
                )}
              </ProductCard>
            );
          })}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            {hasProductsWithoutReturn ? "Cancel" : "Close"}
          </Button>
          
          {hasProductsWithoutReturn && (
            <Button
              disabled={selectedProducts.length === 0 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit Return Request"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}