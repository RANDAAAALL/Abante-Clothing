
export const getNoOrdersDescription = (filter: string) => {
  const descriptions: Record<string, string> = {
    "All": "You don't have any orders yet.",
    "Pending": "You don't have any pending orders.",
    "Processing": "You don't have any orders being processed.",
    "Shipped": "You don't have any shipped orders.",
    "Delivered": "You don't have any delivered orders.",
    "Pending Return": "You don't have any pending return requests.",
    "Returned": "You don't have any returned orders."
  };
  return descriptions[filter] || "You don't have any orders for this status.";
};