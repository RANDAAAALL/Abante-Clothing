import { ProductProps } from "../types/product-types";
import { TshirtType } from "../types/t-shirt-types";
export interface AddToCartPayload {
    product: ProductProps<Partial<TshirtType>>;
    selectedSizeQtyAndColor: {
      size: string | null;
      qty: number;
      color: string | null;
    };
  }
  