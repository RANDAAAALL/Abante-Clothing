export const getDiscountedPrice = (
  price: number | null | undefined,
  discount: number | null | undefined
): number => {
  if (price == null) return 0;
  const priceNum = Number(price);
  const discountNum = Number(discount) || 0;

  if (isNaN(priceNum)) return 0;

  if (discountNum > 0) {
    // Apply discount and round to nearest integer
    return Math.round(priceNum * (1 - discountNum / 100));
  }

  // No discount, return price as is
  return priceNum;
};
