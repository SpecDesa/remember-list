import { Button } from "~/components/ui/button";

export default function DeleteListButton({ listId }: { listId: number }) {
  
  const handleDelete = async (listId: number) => {
    await fetch("/api/db/lists", {
      method: "DELETE",
      body: JSON.stringify({ listId }),
    })
      .then(async (resp) => {
        if (resp.status === 200) {
          await fetch('/api/pusher/communication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: 'delete', listId })
        })
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
