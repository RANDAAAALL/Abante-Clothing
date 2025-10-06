import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TshirtType } from '../types/t-shirt-types';
import { ProductProps } from '../types/product-types';

type selectedSizeAndQtyProps = {
  size: string | null;
  qty: number;
};

export type SelectedItemProps = {
  product: ProductProps<Partial<TshirtType>>;
  selectedSizeAndQty: selectedSizeAndQtyProps;
};

type CartItemsPropsState = {
  selectedSize: string | null;
  quantity: number;
  selectedSizeAndQty: selectedSizeAndQtyProps;
  selectedItem: SelectedItemProps[];
};

type CartItemModalPropsState = {
  isOpen: boolean;
}

type CartItemModalPropsActions = {
  OpenModal: () => void;
  CloseModal: () => void;
}

type CartItemsPropsActions = {
  setSelectedSize: (size: string | null) => void;
  resetSelectedSize: () => void;

  setIncreaseQuantity: () => void;
  setDecreaseQuantity: () => void;
  resetQuantity: () => void;

  setSelectedItems: (item: ProductProps<Partial<TshirtType>>) => void;
  removeSelectedItem: (index: number) => void;
  resetSelectedItem: () => void;
};

export const useCartItemModal = create<CartItemModalPropsState & CartItemModalPropsActions>((set) => ({
  isOpen: false,
  OpenModal: () => set({ isOpen: true }),
  CloseModal: () => set({ isOpen: false })
}))

// persisted store datas
export const useCartItems = create<CartItemsPropsState & CartItemsPropsActions>()(
  persist(
    (set, get) => ({
      selectedSize: null,
      quantity: 1,
      selectedSizeAndQty: { size: null, qty: 1 },
      selectedItem: [],


      setSelectedSize: (size) =>
        set((state) => ({
          selectedSize: size,
          selectedSizeAndQty: { ...state.selectedSizeAndQty, size },
        })),
      resetSelectedSize: () => set({ selectedSize: null }),

      setIncreaseQuantity: () =>
        set((state) => {
          const newQty = state.quantity + 1;
          return {
            quantity: newQty,
            selectedSizeAndQty: { ...state.selectedSizeAndQty, qty: newQty },
          };
        }),
      setDecreaseQuantity: () =>
        set((state) => {
          const newQty = state.quantity > 1 ? state.quantity - 1 : 1;
          return {
            quantity: newQty,
            selectedSizeAndQty: { ...state.selectedSizeAndQty, qty: newQty },
          };
        }),
      resetQuantity: () => set({ quantity: 1, selectedSizeAndQty: { size: null, qty: 1 } }),

      setSelectedItems: (product) =>
        set((state) => {
          const productExistsIndex = state.selectedItem.findIndex(
            (item) =>
              item.product.product_item_ID === product.product_item_ID &&
              item.selectedSizeAndQty.size === state.selectedSizeAndQty.size
          );

          if (productExistsIndex > -1) {
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

          return {
            selectedItem: [
              ...state.selectedItem,
              { product, selectedSizeAndQty: state.selectedSizeAndQty },
            ],
          };
        }),

      removeSelectedItem: (index) =>
        set((state) => ({
          selectedItem: state.selectedItem.filter((_, i) => i !== index),
        })),

      resetSelectedItem: () =>
        set({
          selectedSize: null,
          quantity: 1,
          selectedSizeAndQty: { size: null, qty: 1 },
          selectedItem: [],
        }),
    }),
    {
      name: `${process.env.STRG_NAME as string}`, 
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
