import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Medicine } from '../lib/types';

interface CartState {
  items: CartItem[];
  addItem: (medicine: Medicine, quantity: number) => void;
  removeItem: (medicineId: number) => void;
  updateQuantity: (medicineId: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (medicine: Medicine, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === medicine.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === medicine.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { ...medicine, quantity }],
          };
        });
      },

      removeItem: (medicineId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== medicineId),
        }));
      },

      updateQuantity: (medicineId: number, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === medicineId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      total: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);