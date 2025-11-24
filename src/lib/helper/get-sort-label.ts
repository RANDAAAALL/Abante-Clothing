
export const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case "name-asc":
        return "Name (A-Z)";
      case "name-desc":
        return "Name (Z-A)";
      case "price-asc":
        return "Price (Low to High)";
      case "price-desc":
        return "Price (High to Low)";
      default:
        return "Name (A-Z)";
    }
  };
