import { OrderDetailProps } from "../types/orders-types";
import { ProductItem } from "./order-history-dialog";

export interface ProductLineProps {
    orderDetail: OrderDetailProps;
    onViewReturn: (orderDetail: OrderDetailProps, returnItem: NonNullable<ProductItem["returns"]>[0]) => void;
}