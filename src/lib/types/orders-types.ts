export interface OrderDetailProps {
    order_detail_name: string | null;
    order_detail_qty: number | null;
    order_detail_size: string | null;
    product_items: {
      product_item_color: string | null;
    } | null;
  }
  
  type OrdersProps =  {
    order_purchased_number: string | null; // Order ID
    order_purchased_status: string | null; // Status (pending, shipped, etc.)
    order_purchased_tracking_number: string | null; // Tracking number
    order_purchased_date: Date | null; // Date
  
    // Customer (Shipping Address)
    address_order_purchased_delivery_address_IDToaddress: {
      recipient_first_name: string | null;
      recipient_last_name: string | null;
    } | null;
  
    // Product List
    order_details: OrderDetailProps[];
  
    // Payment Info
    payments: {
      payment_amount: number | null;
    } | null;
};

export type { OrdersProps };
  