// ListsServer.tsx
import { type RelatedUser, getMyLists } from "~/server/db/queries";
import ListsClient from "./lists-client";
import { clerkClient } from "@clerk/nextjs/server";

export default async function ListsServer() {
  const populateListsWithAvatars = async (lists: RelatedUser[]) => {
    for (const list of lists) {
      for (const id of list.ids) {
        const user = await clerkClient.users.getUser(id);
        list.avatars = list.avatars ?? [];
        list.avatars.push({
          clerkId: id,
          imageUrl: user.imageUrl,
          initials: (user.firstName?.charAt(0) ?? '') + (user.lastName?.charAt(0) ?? ''),
        });
      }
    }
  }

  const lists = await getMyLists();
  await populateListsWithAvatars(lists);
    

  return (
    <ListsClient lists={lists}/>
  );
}
