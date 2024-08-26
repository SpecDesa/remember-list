"use client";
import { useRouter } from "next/navigation";
import { useIndexStore } from "~/stores/global-store";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { URLS } from "~/app/_urls/urls";

interface User {
  id: number;
  username: string;
  email: string;
}

export default function DeleteUserFromList() {
  const [users, setUsers] = useState<User[]>([]);
  const { listId, setListId } = useIndexStore();
  const [listName, setListName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (listId && listId === -1) {
      const storedListId = Number(sessionStorage.getItem("huskelisten-listId"));
      if (storedListId) {
        setListId(storedListId);
      }
    }

    if (listId && listId !== -1) {
      sessionStorage.setItem("huskelisten-listId", String(listId));
    }
  }, [listId]);

  //   Fetch users from API
  useEffect(() => {
    if (listId === -1) {
      return;
    }
    // fetch("/api/db/lists/users");
    fetch(`/api/db/lists/users?listId=${listId}`, {
      method: "GET",
    }).then(async (result) => {
      const users: {
        id: number;
        username: string;
        email: string;
      }[] = await result.json();
      const allUsers: User[] = [];
      for (const user of users) {
        allUsers.push({
          id: user.id,
          username: user.username,
          email: user.email,
        });
      }
      setUsers(allUsers);
    });
  }, [listId]);

  useEffect(() => {
    console.log("Running listid fetch", listId);
    if (listId === -1) {
      // console.log("Running listid fetch")
      return;
    }

    fetch(`/api/db/lists?listId=${listId}`, {
      method: "GET",
    }).then(async (result) => {
      const list: {
        id: number;
        name: string;
        type: string;
      } = await result.json();

      setListName(list.name);
    });
  }, [listId]);

  // Fetch listId for setting list name

  return (
    <>
      <h2 className="mb-2 ms-4 text-center text-lg font-semibold sm:text-start">
        Listens navn: {listName}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border p-4 text-center shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold">{user.username}</h2>
            <p className="mb-2 text-sm">{user.email}</p>
            <Button
              variant="destructive"
              // Change delete function to be api for deleting in db.
              onClick={() => handleDeleteUser(user.id)}
            >
              Fjern bruger fra liste
            </Button>
          </div>
        ))}
      </div>
    </>
  );

  async function handleDeleteUser(userId: number) {
    await fetch("/api/db/lists/users", {
      method: "DELETE",
      body: JSON.stringify({ listId, userId }),
    });
    return router.push(URLS.HOME);
  }
}
