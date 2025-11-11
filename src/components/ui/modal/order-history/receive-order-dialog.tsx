"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackDialogProps, ProductItem } from "@/lib/interface/order-history-dialog";
import CustomerFeedbackRating from "../../customer-feedback-rating";
import toast from "react-hot-toast";
import { AddFeedbackURL } from "@/lib/config";
import { fetchWithCsrf } from "@/lib/helper/custom-fetch";
import { useProductStatus } from "@/hooks/useProductStatus";
import { SelectAllButton } from "../../product/select-all-button";
import { ProductCard } from "../../product/product-card";

export default function ReceiveOrderDialog({
  isOpen,
  onClose,
  order,
  onUpdate
}: FeedbackDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [feedbackComments, setFeedbackComments] = useState<{ [key: string]: string }>({});
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localProducts, setLocalProducts] = useState<ProductItem[]>([]);
  
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
      setFeedbackComments({});
      setRatings({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const toggleProductSelection = (id: string) => {
    const product = localProducts.find(p => String(p.order_detail_ID) === id);
    if (!product) return;

    const { isReturned } = getReturnStatus(product);
    
    if (isReturned) {
      toast.error("This product has a return request and cannot be marked as received.");
      return;
    }

    setSelectedProducts((prev) => {
      const isCurrentlySelected = prev.includes(id);
      
      if (isCurrentlySelected) {
        // If unselecting, reset the rating and comment for this product
        setRatings(prevRatings => {
          const newRatings = { ...prevRatings };
          delete newRatings[id];
          return newRatings;
        });
        setFeedbackComments(prevComments => {
          const newComments = { ...prevComments };
          delete newComments[id];
          return newComments;
        });
        
        return prev.filter((p) => p !== id);
      } else {
        // If selecting, initialize with default rating 0
        setRatings(prev => ({ ...prev, [id]: 0 }));
        return [...prev, id];
      }
    });
  };

  const handleRatingChange = (id: string, value: number) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentChange = (id: string, comment: string) => {
    setFeedbackComments((prev) => ({ ...prev, [id]: comment }));
  };

  const handleSelectAll = () => {
    const availableProducts = localProducts
      .filter(product => {
        const hasFeedback = !!product.feedback_rating;
        const { isReturned } = getReturnStatus(product);
        return !hasFeedback && !isReturned;
      })
      .map(product => String(product.order_detail_ID));
    
    setSelectedProducts(availableProducts);
    
    // Initialize all selected products with rating 0
    const initialRatings: { [key: string]: number } = {};
    availableProducts.forEach(id => {
      initialRatings[id] = 0;
    });
    setRatings(initialRatings);
  };

  const handleDeselectAll = () => {
    setRatings({});
    setFeedbackComments({});
    setSelectedProducts([]);
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to receive.");
      return;
    }

    const unratedProducts = selectedProducts.filter((id) => !ratings[id] || ratings[id] === 0);
    if (unratedProducts.length > 0) {
      toast.error("Please rate all selected products before submitting.");
      return;
    }

    setIsSubmitting(true);
    const originalProducts = [...localProducts];

    // Optimistic update
    const updatedProducts = localProducts.map(product => {
      if (selectedProducts.includes(String(product.order_detail_ID))) {
        return {
          ...product,
          feedback_comment: feedbackComments[String(product.order_detail_ID)] || "",
          feedback_rating: ratings[String(product.order_detail_ID)] || 0,
        };
      }
      return product;
    });

    setLocalProducts(updatedProducts);

    try {
      const orderData = selectedProducts.map((order_detail_ID) => ({
        order_detail_ID,
        rating: ratings[order_detail_ID] || 0,
        feedback: feedbackComments[order_detail_ID] || "",
      }));

      await toast.promise(
        (async () => {
          const res = await fetchWithCsrf(`${AddFeedbackURL}`, {
            method: "POST",
            body: JSON.stringify({ orderData }),
          });
          
          const data = await res.json();
          if (!res.ok) throw new Error(`${data?.errorMessage}`);
          return data;
        })(),
        {
          loading: "Confirming order...",
          success: (data) => {
            return data?.successMessage || "Order received successfully!";
          },
          error: (e) => {
            setLocalProducts(originalProducts);
            return e?.message || "Failed to confirm receipt.";
          },
        }
      );

      setSelectedProducts([]);
      setFeedbackComments({});
      setRatings({});
      onUpdate?.();

    } catch (error) {
      // Error is already handled in toast.promise
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if any products still need to be received
  const hasProductsWithoutFeedback = localProducts.some(
    (product) => {
      const hasFeedback = !!product.feedback_rating;
      const { isReturned } = getReturnStatus(product);
      return !hasFeedback && !isReturned;
    }
  );

  const availableProductsCount = localProducts.filter(
    product => {
      const hasFeedback = !!product.feedback_rating;
      const { isReturned } = getReturnStatus(product);
      return !hasFeedback && !isReturned;
    }
  ).length;

  const isAllSelected = selectedProducts.length === availableProductsCount && availableProductsCount > 0;

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md dark:bg-card-black-background">
        <DialogHeader>
          <DialogTitle>
            {hasProductsWithoutFeedback
              ? "Confirm You've Received Your Order"
              : "Order Completed"}
          </DialogTitle>
          <DialogDescription>
            {hasProductsWithoutFeedback 
              ? "Select which product(s) you have received and rate your experience."
              : "All products in this order have been received, returned, or have pending requests."
            }
          </DialogDescription>
        </DialogHeader>

        {/* Select All Button */}
        {hasProductsWithoutFeedback && (
          <SelectAllButton
            selectedCount={selectedProducts.length}
            totalCount={availableProductsCount}
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}

        {/* Product List */}
        <div className="space-y-3 mt-3 max-h-64 overflow-y-auto pr-1">
          {localProducts.map((product) => {
            const id = `${product.order_detail_ID}`;
            const isSelected = selectedProducts.includes(id);
            const alreadyReceived = !!product.feedback_rating;
            const returnStatus = getReturnStatus(product);
            const canSelect = !alreadyReceived && !returnStatus.isReturned;

            // Determine border color
            let borderColor = "border-gray-300 dark:border-gray-400";
            if (alreadyReceived) {
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
                {/* Rating & Comment */}
                {(isSelected || alreadyReceived) && !returnStatus.isReturned && (
                  <div className="mt-2 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-600 dark:text-gray-400">
                        {alreadyReceived ? "Your Rating: " : "Rating: "}
                      </label>
                      <CustomerFeedbackRating
                        rating={ratings[id] ?? product.feedback_rating ?? 0}
                        max={5}
                        onChange={(value) => !alreadyReceived && handleRatingChange(id, value)}
                      />
                    </div>

                    {!alreadyReceived && (
                      <div>
                        <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                          Feedback (optional):
                        </label>
                        <textarea
                          placeholder="Share your experience with this product..."
                          className="w-full border rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                          rows={2}
                          value={feedbackComments[id] || ""}
                          onChange={(e) => handleCommentChange(id, e.target.value)}
                        />
                      </div>
                    )}

                    {alreadyReceived && product.feedback_comment && (
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Your comment: &quot;{product.feedback_comment}&quot;
                      </p>
                    )}
                  </div>
                )}

                {/* Returned product display */}
                {(returnStatus.isReturnAccepted || returnStatus.isReturnRejected || returnStatus.hasPendingReturn) && returnStatus.hasReturns && (
                  <div className="mt-2">
                    {returnStatus.latestReturn?.returned_product_reason && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                        Return reason: &quot;{returnStatus.latestReturn.returned_product_reason}&quot;
                      </p>
                    )}
                    {returnStatus.latestReturn?.returned_product_qty && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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
              </ProductCard>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            {hasProductsWithoutFeedback ? "Cancel" : "Close"}
          </Button>
          
          {hasProductsWithoutFeedback && (
            <Button
              disabled={selectedProducts.length === 0 || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Confirm Receive Order"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}