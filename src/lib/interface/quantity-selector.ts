export interface QuantitySelectorProps {
    quantity: number;
    min?: number;
    max: number;
    onQuantityChange: (quantity: number) => void;
    label?: string;
  }