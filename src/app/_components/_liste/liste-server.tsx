"use server";
// ListeServer.tsx
import { getItems } from '~/server/db/queries';

interface ListeServerProps {
  listId: number;
}

export default async function ListeServer({listId}: ListeServerProps) {
    const items = await getItems(listId)
    console.log("Items", items)
// }
    // console.log(items)

  return items
};

