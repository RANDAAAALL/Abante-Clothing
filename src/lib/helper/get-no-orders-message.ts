
export const getNoOrdersMessage = (filter: string) => {
    const messages: Record<string, string> = {
      "All": "No orders found",
      "Pending": "No Pending orders found",
      "Processing": "No Processing orders found", 
      "Shipped": "No Shipped orders found",
      "Delivered": "No Delivered orders found",
      "Pending Return": "No Pending Return orders found",
      "Returned": "No Returned orders found"
    };
    return messages[filter] || "No orders found";
  };
  