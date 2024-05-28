// ListsServer.tsx
import { getMyLists } from "~/server/db/queries";
import ListsClient from "./lists-client";

export default async function ListsServer() {
  const lists = await getMyLists();

  return (
    <ListsClient lists={lists} />
  );
}
