import { create } from 'zustand'
import { type ItemSlice, createItemSlice } from './item-store'


export const useIndexStore = create<ItemSlice>()((...a) => ({
    ...createItemSlice(...a),
    // ...createFishSlice(...a),
    // ...createSharedSlice(...a),
  }))