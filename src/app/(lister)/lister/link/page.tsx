"use client";
import { useRouter } from "next/navigation";
import { useIndexStore } from "~/stores/global-store";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { URLS } from "~/app/_urls/urls";
import { RelatedUser } from "~/server/db/queries";
import { ListStatus } from "~/server/db/types";


export default function DeleteUserFromList() {
  const { listId, setListId } = useIndexStore();
  const [listName, setListName] = useState<string>("");
  const [lists, setLists] = useState<RelatedUser[]>([]);
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
  // useEffect(() => {
  //   if (listId === -1) {
  //     return;
  //   }
  //   // fetch("/api/db/lists/users");
  //   fetch(`/api/db/lists/users?listId=${listId}`, {
  //     method: "GET",
  //   }).then(async (result) => {
  //     const users: {
  //       id: number;
  //       username: string;
  //       email: string;
  //     }[] = await result.json();
  //     const allUsers: User[] = [];
  //     for (const user of users) {
  //       allUsers.push({
  //         id: user.id,
  //         username: user.username,
  //         email: user.email,
  //       });
  //     }
  //     setUsers(allUsers);
  //   });
  // }, [listId]);


  useEffect(() => {
    fetch('/api/lists', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(async resp => {
      const lists = await resp.json();
      setLists(lists);
    })
  }, [])

  useEffect(() => {
    if (listId === -1) {
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
        {lists
        .filter(list => list.listType === ListStatus.STOCKING)
        .map((list) => (
          <div
            key={list.listId}
            className="rounded-lg border p-4 text-center shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold">{list.name}</h2>
            {/* <p className="mb-2 text-sm">{list.listType}</p> */}
            {/* {<div>list child: {list.childListId}</div>}
            {<div>list: {listId}</div>} */}
            {
              (!list?.childListId?.includes(listId)) &&
              <Button
              variant="default"
              // Change delete function to be api for deleting in db.
              onClick={() => createLinking(list.listId)}
              >
              Opdater denne liste ved ændringer
            </Button>
            }

            {list?.childListId?.includes(listId) &&
              <Button
              variant="destructive"
              // Change delete function to be api for deleting in db.
              onClick={() => deleteLinking(list.listId)}
              >
              Fjern link mellem lister
            </Button>
            }
          </div>
        ))}
      </div>
    </>
  );

  async function createLinking(listToUpdateID: number) {
    const result = await fetch("/api/lists", {
      method: "PUT",
      body: JSON.stringify({ childListId: listId, parentListId: listToUpdateID}),
    });

    if(result.status >= 200 && result.status <= 299){
      return router.push(URLS.HOME);
    }
    else {
      console.error("Error creating link between lists.")
    }

  }
  async function deleteLinking(listToUpdateID: number) {
    const result = await fetch("/api/lists", {
      method: "PUT",
      body: JSON.stringify({ childListId: listId, parentListId: listToUpdateID, delete: true}),
    });

    if(result.status >= 200 && result.status <= 299){
      return router.push(URLS.HOME);
    }
    else {
      console.error("Error deleting link between lists.")
    }

  }
}
