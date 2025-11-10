export interface ProductItem {
  order_detail_ID: number; 
  order_purchased_ID: number;
  name: string;
  size: string;
  color: string;
  image: string;
  qty: number;
  price: number;
  feedback_comment: string;
  feedback_rating: number;
  
  returns?: {
    return_ID: number;
    order_detail_ID: number | null;
    is_returned: number | null;
    returned_product_name: string | null;
    returned_product_price: number | null;
    returned_product_color: string | null;
    returned_product_qty: number | null;
    returned_product_size: string | null;
    returned_product_image: string[] | null;
    returned_product_reason: string | null;
    request_return_date: Date | string | null;
    returned_date: Date | string | null;
    is_return_accepted: string | null;
  }[]
}

export interface OrderItem {
  order_purchased_number: string;
  products: ProductItem[];
}

export interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null; 
  onUpdate?: () => void;
}

export interface ReturnRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderItem | null
  onUpdate?: () => void;
}