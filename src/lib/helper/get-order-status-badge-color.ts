
export const getStatusBadgeColor = (status: string | null) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending_return":
        return "bg-orange-300 text-orange-800";
      default:
        return "bg-red-500 text-red-800";
    }
  };