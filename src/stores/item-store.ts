
import { type StateCreator } from "zustand";

export interface Item {
  id: number;
  name: string;
  quantity: number;
  bought: boolean;
}

// Define the interface for the item slice
export interface ItemSlice {
  items: Item[];
  addItem: (id: number, name: string, quantity: number, bought?: boolean) => void;
  clearItems: () => void;
  removeItem: (id: number) => void;
  increaseQuantity: (id: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  decreaseQuantity: (id: number) => void;
  toggleBought: (id: number) => void;
}

export const createItemSlice: StateCreator<
  ItemSlice,
  [],
  [],
  ItemSlice
> = (set) => ({
  items: [],

  addItem: (id: number, name: string, quantity: number, bought = false) => set((state) => ({
    items: [
      ...state.items,
      { id: id, name, quantity: quantity, bought: bought },
    ],
  })),

  clearItems: () => set({ items: [] }),

  removeItem: (id: number) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),

  increaseQuantity: (id: number) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ),
  })),

  setQuantity: (id: number, quantity: number) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: quantity } : item
    ),
  })),

  decreaseQuantity: (id: number) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0 } : item
    ),
  })),

  toggleBought: (id: number) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, bought: !item.bought } : item
    ),
  })),
})
