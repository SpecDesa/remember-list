"use server";
// ListeServer.tsx
import { getItems, updateItemQuantity } from '~/server/db/queries';

interface ListeServerProps {
  listId: number;
}

export const getItemsFromList = async ({listId}: ListeServerProps) => {
    const items = await getItems(listId)

  return items
};

export const updateItemFromList = async ({id, quantity}: {id: number, quantity: number}) => {
  void updateItemQuantity(id,quantity);
};


