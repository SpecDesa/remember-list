import { type StateCreator } from "zustand";

export interface ListItem {
  listId: string;
  userId: string
}

// Define the interface for the item slice
export interface ListItemSlice {
  listId: number;
  setListId: (id: number) => void;
  listItems: ListItem[];
  urlOnSuccess: string;
  setUrlOnSuccess: (url: string) => void;
  addListItem: (userId: string, listId: string) => void;
  clearListItem: () => void;
}

export const createListItemSlice: StateCreator<
  ListItemSlice,
  [],
  [],
  ListItemSlice
> = (set) => ({
  listId: -1,
  setListId: (id) => set(() => ({
    listId: id,
  })),

  listItems: [],
  
  urlOnSuccess: '',
  
  setUrlOnSuccess: (url: string) => set(() => ({
    urlOnSuccess: url
  })),

  addListItem: (userId: string, listId: string) => set((state) => ({
    listItems: [
      ...state.listItems,
      { listId, userId},
    ],
  })),

  clearListItem: () => set({ listItems: [] }),
})
