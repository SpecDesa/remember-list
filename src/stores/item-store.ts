import { type StateCreator } from "zustand";

export interface Item {
  id: string;
  name: string;
  quantity: number;
  isBought: boolean;
}

// Define the interface for the item slice
export interface ItemSlice {
  items: Item[];
  addItem: (name: string, quantity: number) => void;
  removeItem: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  toggleBought: (id: string) => void;
}

export const createItemSlice: StateCreator<
  ItemSlice,
  [],
  [],
  ItemSlice
> = (set) => ({
  items: [],

  addItem: (name: string, quantity: number) => set((state) => ({
    items: [
      ...state.items,
      { id: `${Date.now()}_${name}`, name, quantity: quantity, isBought: false },
    ],
  })),

  removeItem: (id: string) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),

  increaseQuantity: (id: string) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ),
  })),

  decreaseQuantity: (id: string) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: item.quantity > 0 ? item.quantity - 1 : 0 } : item
    ),
  })),

  toggleBought: (id: string) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, isBought: !item.isBought } : item
    ),
  })),
})
