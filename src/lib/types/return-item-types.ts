
type ReturnItemProps = {
    order_detail_ID: string;
    returned_product_name: string;
    returned_product_qty: number;
    returned_product_size: string;
    returned_product_color: string;
    returned_product_price: number;
    returned_product_image: string | string[];
    returned_product_reason: string;
};

export type { ReturnItemProps };