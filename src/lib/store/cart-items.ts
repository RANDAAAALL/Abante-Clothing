import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TshirtType } from '../types/t-shirt-types';
import { ProductProps } from '../types/product-types';

type selectedSizeQtyAndColorProps = {
  size: string | null;
  qty: number;
  color: string | null;
};

export type SelectedItemProps = {
  product: ProductProps<Partial<TshirtType>>;
  selectedSizeQtyAndColor: selectedSizeQtyAndColorProps;
};

type CartItemsPropsState = {
  selectedSize: string | null;
  quantity: number;
  selectedColor: string | null;
  selectedSizeQtyAndColor: selectedSizeQtyAndColorProps;
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

  setSelectedColor: (color: string) => void;
  resetSelectedColor?: () => void;

  setIncreaseQuantity: (maxStock: number) => void;
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
      selectedColor: null,
      selectedSizeQtyAndColor: { size: null, qty: 1, color: null },
      selectedItem: [],

      setSelectedSize: (size) =>
        set((state) => ({
          selectedSize: size,
          selectedSizeQtyAndColor: { ...state.selectedSizeQtyAndColor, size },
        })),
      resetSelectedSize: () => set({ selectedSize: null }),

      setSelectedColor: (color) =>
        set((state) => ({
          selectedColor: color,
          selectedSizeQtyAndColor: { ...state.selectedSizeQtyAndColor, color}
        })),
      resetSelectedColor: () => set({ selectedColor: null }),

      setIncreaseQuantity: (maxStock?: number) =>
        set((state) => {
          const newQty = maxStock && state.quantity < maxStock
          ? state.quantity + 1
          : state.quantity;
        return {
          quantity: newQty,
          selectedSizeQtyAndColor: { ...state.selectedSizeQtyAndColor, qty: newQty },
        };
      }),
      setDecreaseQuantity: () =>
        set((state) => {
          const newQty = state.quantity > 1 ? state.quantity - 1 : 1;
          return {
            quantity: newQty,
            selectedSizeQtyAndColor: { ...state.selectedSizeQtyAndColor, qty: newQty },
          };
        }),
      resetQuantity: () => set({ quantity: 1, selectedSizeQtyAndColor: { size: null, qty: 1, color: null } }),

      setSelectedItems: (product) =>
        set((state) => {
          const productExistsIndex = state.selectedItem.findIndex(
            (item) =>
              item.product.product_item_ID === product.product_item_ID &&
              item.selectedSizeQtyAndColor.size === state.selectedSizeQtyAndColor.size &&
              item.selectedSizeQtyAndColor.color === state.selectedSizeQtyAndColor.color
          );

          if (productExistsIndex > -1) {
            const updatedItems = [...state.selectedItem];
            updatedItems[productExistsIndex] = {
              ...updatedItems[productExistsIndex],
              selectedSizeQtyAndColor: {
                ...updatedItems[productExistsIndex].selectedSizeQtyAndColor,
                qty:
                  updatedItems[productExistsIndex].selectedSizeQtyAndColor.qty +
                  state.selectedSizeQtyAndColor.qty,
              },
            };
            return { selectedItem: updatedItems };
          }

          return {
            selectedItem: [
              ...state.selectedItem,
              { product, selectedSizeQtyAndColor: state.selectedSizeQtyAndColor },
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
          selectedColor: null,
          selectedSizeQtyAndColor: { size: null, qty: 1, color: null },
          selectedItem: [],
        }),
    }),
    {
      name: `${process.env.NEXT_PUBLIC_STRG_NAME as string}`, 
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
