

type CartItemsProps = {
    product_item_ID: number | null;
    user_ID?: number | null;
    cart_item_ID: number;
    cart_item_image: string | null;
    cart_item_name: string | null;
    cart_item_price: number | null;
    cart_item_size: string | null;
    cart_item_color: string | null;
    cart_item_qty: number | null;
    cart_item_total?: number | null;
    cart_item_date?: Date | null;
};

export type { CartItemsProps };