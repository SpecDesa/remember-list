"use client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { type RelatedUser } from "~/server/db/queries";
import GetAvatar from "../get-avatar";
import { URLS } from "../../_urls/urls";
import GoToButton from "../go-to-button";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useRouter } from "next/navigation";
import { ListStatus } from "~/server/db/types";
import { ListAction } from "../../(lister)/lister/page";
import Swipeable from "../swipeable";
import DeleteListButton from "./delete-list-button";
import { pusherClient } from "~/server/pusher/pusherClient";
import { useIndexStore } from "~/stores/global-store";

export const dynamic = "force-dynamic";

interface ListsClientProps {
  lists: RelatedUser[];
}

const ListsClient: FC<ListsClientProps> = ({ lists: listsProp }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [lists, setLists] = useState(listsProp);
  const [activeOptionsListId, setActiveOptionsListId] = useState<number | null>(null);
  const {
    setUrlOnSuccess,
    setListId,
  } = useIndexStore();

  useEffect(() => {
    const channel = pusherClient
      .subscribe("private-chat-lists")
      .bind("evt::list-update", (data: { listId: number; type: string }) => {
        const { listId, type } = data;
        if (type === "delete") {
          setLists((prevLists) =>
            prevLists.filter((list) => list.listId !== listId),
          );
        }
      })
      .bind(
        "evt::list-create",
        (data: RelatedUser) => {
          const aRelatedUser: RelatedUser & {listId: number} = {
            name: data.name,
            avatars: data.avatars, 
            ids: data.ids,
            listId: data.listId,
            listType: data.listType
          }
          setLists((prevLists) => [...prevLists, aRelatedUser]);
        },
      );
    return () => {
      channel.unbind();
      pusherClient.unsubscribe("private-chat-lists");
    };
  }, []);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleListClick = useCallback(
    (list: RelatedUser) => {
      if (list.listId === activeOptionsListId) return; // Prevent navigation if options menu is open
      if (list.listType === ListStatus.SHOPPING.valueOf()) {
        router.push(`/liste?listId=${list.listId}&action=${ListAction.Buy}`);
      } else if (list.listType === ListStatus.STOCKING.valueOf()) {
        router.push(`/liste?listId=${list.listId}&action=${ListAction.View}`);
      } else {
        router.push(`/${URLS.HOME}`);
      }
    },
    [router, activeOptionsListId],
  );

  const toggleOptionsMenu = (listId: number) => {
    setActiveOptionsListId((prev) => (prev === listId ? null : listId));
  };

  const closeOptionsMenu = () => {
    setActiveOptionsListId(null);
  };

  const renderedLists = useMemo(
    () =>
      lists.map((list, idx) => (
        <div key={idx + "_outer"} className="flex flex-row relative">
          <Swipeable
            key={idx + "_outer"}
            deleteButton={<DeleteListButton listId={list.listId} />}
            signalFullLeftSwipe={async () => {
              await fetch("/api/db/lists", {
                method: "DELETE",
                body: JSON.stringify({ listId: list.listId }),
              })
                .then(async (resp) => {
                  if (resp.status === 200) {
                    await fetch("/api/pusher/communication", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        type: "delete",
                        listId: list.listId,
                      }),
                    });
                  }
                })
                .catch((error) => {
                  console.log("error", error);
                });
            }}
          >
            <div
              className="shadow-3xl transform bg-white transition-all duration-300 md:hover:translate-y-1 hover:cursor-pointer md:hover:bg-gray-300"
              onClick={() => handleListClick(list)}
            >
              <div className="mx-2 flex justify-between text-center text-sm text-black">
                <div>{list.name}</div>
                <div
                  className="cursor-pointer"
                  onClick={(e) => {
                    setListId(list.listId);
                    setUrlOnSuccess(URLS.HOME);
                    e.stopPropagation(); // Prevent triggering the parent click event
                    toggleOptionsMenu(list.listId);
                  }}
                >
                  ...
                </div>
              </div>
              <div className="mx-2 flex items-center space-x-[-20px]">
                {list.avatars?.map((props, idx) => (
                  <GetAvatar
                    key={`${idx}_${props.clerkId}`}
                    clerkId={props.clerkId}
                    imageUrl={props.imageUrl}
                    initials={props.initials}
                  />
                ))}
              </div>
            </div>
            {activeOptionsListId === list.listId && (
              <div className="flex text-sm text-black">
                <ul className="w-full"> 
                  <li
                    className="flex justify-center ps-4 py-2 mt-2 bg-white w-full"
                    onClick={() => {
                      router.push(URLS.ADD_USER_TO_LIST)
                      closeOptionsMenu();
                    }}
                  >
                    Tilføj bruger til liste
                  </li>
                  <li
                    className="flex justify-center ps-4 py-2 mt-1 mb-4 bg-white w-full"
                    onClick={() => {
                      // router.push(URLS.REMOVE_USER_FROM_LIST)
                      closeOptionsMenu();
                    }}
                  >
                    Fjern bruger fra liste
                  </li>
                </ul>
              </div>
            )}
          </Swipeable>
        </div>
      )),
    [lists, activeOptionsListId, handleListClick],
  );

  if (!isMounted) {
    return null;
  }

  return (
    <div className="h-[60vh] content-end">
      <h2 className="mb-2 ms-8 flex text-2xl">Dine Lister</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <ScrollArea className="h-[380px] w-5/6 gap-4 rounded-md md:h-[600px] md:w-2/3">
          <div className="flex flex-col gap-1 p-4">{renderedLists}</div>
        </ScrollArea>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <GoToButton text="Tilføj ny liste" url={`${URLS.LISTS}?action=create`} />
      </div>
    </div>
  );
};

export default ListsClient;
