"use server";
// ListeServer.tsx
import { getItems, updateItemQuantity, updateItemBought, deleteItem, updateRelationShip } from '~/server/db/queries';

interface ListeServerProps {
  listId: number;
}

export const getItemsFromList = async ({listId}: ListeServerProps) => {
    const items = await getItems(listId)

  return items
};

export const updateItemQuantityFromList = async ({id, quantity}: {id: number, quantity: number}) => {
  void updateItemQuantity(id,quantity);
};

export const deleteItemFromList = async ({listId, id}: {listId: number, id: number}) => {
  void deleteItem(listId, id);
};

export const updateItemBoughtFromList = async ({id, bought, listId}: {id: number, bought: boolean, listId?: number}) => {
  if(listId){
    void updateRelationShip({itemId: id, listId})
  }
  void updateItemBought(id, bought);

};


