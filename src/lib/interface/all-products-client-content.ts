import { TshirtType } from "../types/t-shirt-types";

export interface AllProductsClientContentProps {
  initialProducts: TshirtType[];
  query?: string;
  sort?: string;
}
