import { create } from 'zustand';
import { TshirtType } from '../types/t-shirt-types';
import { ProductProps } from '../types/product-types';

type selectedSizeAndQtyProps = {
    size: string | null,
    qty: number,
}

type SelectedItemProps = {
    product:  ProductProps<Partial<TshirtType>>,
    selectedSizeAndQty: selectedSizeAndQtyProps, 
}

type CartItemsPropsState = {
    selectedSize: string | null;
    quantity: number;
    selectedItem: SelectedItemProps[];
}

type CartItemsPropsActions = {
    setSelectedSize: (size: string | null) => void;
    clearSelectedSize: () => void;

    setIncreaseQuantity: (qty: number) => void;
    setDecreaseQuantity: (qty: number) => void;
    resetQuantity: () => void;

    selectedSizeAndQty: selectedSizeAndQtyProps;

    setSelectedItems: (item: ProductProps<Partial<TshirtType>>) => void;
    clearSelectedItem: () => void; 
}

export const useCartItems = create<CartItemsPropsState & CartItemsPropsActions>((set) => ({
    selectedSize: null,
    setSelectedSize: (size) =>
     set((state) => ({
        selectedSize: size,
        selectedSizeAndQty: {
            ...state.selectedSizeAndQty, size,
        }
    })),
    clearSelectedSize: () => set({ selectedSize: null }),

    quantity: 1,
    setIncreaseQuantity: () =>
    set((state) => {
        const newQty = state.quantity + 1;
        return {
            quantity: newQty,
            selectedSizeAndQty: { ...state.selectedSizeAndQty, qty: newQty},
        };
    }),
    setDecreaseQuantity: () =>
    set((state) => {
        const newQty = state.quantity > 1 ? state.quantity - 1 : 1;
        return {
            quantity: newQty,
            selectedSizeAndQty: { ...state.selectedSizeAndQty, qty: newQty},
        };
    }),
    resetQuantity: () => set({ quantity: 1}),

    selectedSizeAndQty: { size: null,  qty: 1},

    selectedItem: [],
    setSelectedItems: (product) =>
    set((state) => {
      const productExistsIndex = state.selectedItem.findIndex(
        (item) =>
          item.product.product_item_ID === product.product_item_ID &&
          item.selectedSizeAndQty.size === state.selectedSizeAndQty.size
      );
  
      if (productExistsIndex > -1) {
        // if product + size already exists, update its qty
        const updatedItems = [...state.selectedItem];
        updatedItems[productExistsIndex] = {
          ...updatedItems[productExistsIndex],
          selectedSizeAndQty: {
            ...updatedItems[productExistsIndex].selectedSizeAndQty,
            qty:
              updatedItems[productExistsIndex].selectedSizeAndQty.qty +
              state.selectedSizeAndQty.qty,
          },
        };
        return { selectedItem: updatedItems };
      }
  
      // if product + size doesnt exist, add it as new item
      return {
        selectedItem: [
          ...state.selectedItem,
          { product, selectedSizeAndQty: state.selectedSizeAndQty },
        ],
      };
    }),  

    clearSelectedItem: () => set({ selectedItem: [] }),
}));

