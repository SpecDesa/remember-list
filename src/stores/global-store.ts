import { create } from 'zustand'
import { type ItemSlice, createItemSlice } from './item-store'
import { type ListItemSlice, createListItemSlice } from './list-item-store'


export const useIndexStore = create<ItemSlice & ListItemSlice>()((...a) => ({
    ...createItemSlice(...a),
    ...createListItemSlice(...a)
  }))