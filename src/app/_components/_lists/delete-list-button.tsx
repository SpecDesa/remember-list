// ListsServer.tsx
// import { type RelatedUser, getMyLists } from "~/server/db/queries";
// import ListsClient from "./lists-client";
// import { clerkClient } from "@clerk/nextjs/server";
import { Button } from "~/components/ui/button";

export default function DeleteListButton({ listId }: { listId: number }) {
  
  const handleDelete = async (listId: number) => {
    await fetch("/api/db/lists", {
      method: "DELETE",
      body: JSON.stringify({ listId }),
    })
      .then((resp) => {
        if (resp.status === 200) {
          console.log("Worked");
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Button
      onClick={async (e) => {
        e.stopPropagation();
        await handleDelete(listId);
      }}
      variant={"destructive"}
      className="h-full w-3/4"
    >
      Delete
    </Button>
  );
}
