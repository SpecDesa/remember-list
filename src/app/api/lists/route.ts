import { useAuth, useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  RelatedUser,
  createList,
  deleteLinkLists,
  getMyLists,
  linkLists,
} from "~/server/db/queries";
import { type ListStatus } from "~/server/db/types";
import { getPusherInstance } from "~/server/pusher/pusherServer";
import { clerkClient } from "@clerk/nextjs/server";

const pusherServer = getPusherInstance();

export async function POST(req: Request) {
  // const auth = useAuth();
  // const userInfo = useUser();

  const listObj = (await req.json()) as unknown as {
    name: string;
    type: ListStatus;
  };
  const createdObj = await createList(listObj);
  if (createdObj) {
    await pusherServer.trigger(
      "private-chat-lists",
      "evt::list-create",
      createdObj,
    );
    return Response.json({ msg: "Created" });
  }
  return Response.json({ msg: "Didn't create list" }, { status: 500 });
}

export async function PUT(req: NextRequest) {
  const listObj = (await req.json()) as unknown as {
    parentListId: number;
    childListId: number;
    delete?: boolean;
  };

  if (listObj.delete) {
    const result = await deleteLinkLists({
      parentListId: listObj.parentListId,
      childListId: listObj.childListId,
    });

    if (result) {
      await pusherServer.trigger(
        "private-chat-lists",
        "evt::list-relationship-link-delete",
        result,
      );
      return Response.json({
        msg: `Link deleted between lists with id: ${listObj.childListId} and : ${listObj.parentListId}`,
      });
    }
  }
   
  
  else {

    const result = await linkLists({
      parentListId: listObj.parentListId,
      childListId: listObj.childListId,
    });

    if (result) {
      await pusherServer.trigger(
        "private-chat-lists",
        "evt::list-relationship-link-create",
        result,
      );
      return Response.json({
        msg: `Link created between lists with id: ${listObj.childListId} and : ${listObj.parentListId}`,
      });
    }
    return Response.json(
      { msg: "Didn't create link between lists" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const user = auth();

  if (!user.userId) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  const lists = await getMyLists();
  await populateListsWithAvatars(lists);

  return NextResponse.json(lists);
}

async function populateListsWithAvatars(
  lists: RelatedUser[],
) {
  for (const list of lists) {
    for (const id of list.ids) {
      const user = await clerkClient.users.getUser(id);
      list.avatars = list.avatars ?? [];
      list.avatars.push({
        clerkId: id,
        imageUrl: user.imageUrl,
        initials:
          (user.firstName?.charAt(0) ?? "") + (user.lastName?.charAt(0) ?? ""),
      });
    }
  }
}
