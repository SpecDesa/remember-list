// ListsServer.tsx
import { ScrollArea } from "~/components/ui/scroll-area";
import { getMyLists } from "~/server/db/queries";
import ListsClient from "./lists-client";

export const dynamic = "force-dynamic";

export default async function ListsServer() {
  const lists = await getMyLists();

  return (
    <ListsClient lists={lists} />
  );
}
