import { OrderHistoryProductValueProps } from "../types/order-history-product-type";

// check if value is of type ProductValue
export const isProductValue = (v: unknown): v is OrderHistoryProductValueProps =>
typeof v === "object" && v !== null && "name" in v && "image" in v;
