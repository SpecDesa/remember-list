import "server-only";
import { db } from ".";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { items, lists, listsRelationships, listsUsers, users } from "./schema";
import { and, eq, sql } from "drizzle-orm/sql";
import type { UserSignup, UserDeleted } from "~/types/clerk/clerk-user";
import { type ItemType, type ListStatus } from "./types";

export interface RelatedUser {
  avatars?: {clerkId: string, imageUrl:string, initials: string}[];
  name: string;
  ids: string[]; // Define type for userEmail as string array
  listId: number;
  listType: string;
}

export async function getItems(listId: number) {

  const items: ItemType[] = await db.query.items.findMany({
    orderBy: (model, { desc }) => desc(model.id), // Make newest come first. maybe lowest quantity first.
    where: (model, {eq}) => eq(model.listsId, listId ) 
  });

  return items;
}

export async function updateItemQuantity(itemId: number, quantity: number){
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const userDbObj = await getDBUserId(user.userId);

  if (!userDbObj?.id) {
    return [];
  }

  await db.transaction(async (tx) => {
    // Get listsId from item
    const dbItem = await tx.query.items.findFirst({
      where: (model, { eq }) => eq(model.id, itemId),
    });

    if(!dbItem?.id){
      console.error(`Could not find list that item to update belonged to. itemId: ${itemId}, dbItem id: ${dbItem?.id}`)
      return
    }
    // find entry in listsusers where userId and listsid is there
    const userAllowedToUpdate = await tx.query.listsUsers.findFirst({
      where: (model, {eq, and}) => and(eq(model.usersId, userDbObj.id), eq(model.listsId, dbItem.listsId) )
    });

    if(!userAllowedToUpdate){
      console.error(`User ${userDbObj.id} is not allowed to update item with id: ${itemId}`)
      return 
    }
    // Future check role of user (viewer, admin, executor, etc..)

    // update quantity
    await tx.update(items).set({quantity: quantity}).where(eq(items.id, itemId)).returning();
  });


}

export async function deleteUser(deleteObj: UserDeleted) {
  const userAuthId = deleteObj?.data?.id;

  // Start a transaction
  await db.transaction(async (tx) => {
    // Get db userid
    const dbUsers = await tx
      .select()
      .from(users)
      .where(eq(users.clerkId, userAuthId));

    // user from db.
    const user = dbUsers?.at(0);

    // If user not found, return. Something went wrong
    if (!user) {
      return;
    }

    // Delete entries from lists_users where usersId matches the userId
    const listIds = await tx
      .delete(listsUsers)
      .where(eq(listsUsers.usersId, user.id))
      .returning({ listIds: listsUsers.listsId });

    for (const listId of listIds) {
      const listLeft = await tx
        .select()
        .from(listsUsers)
        .where(eq(listsUsers.listsId, Number(listId.listIds)));
      

      if (listLeft.length === 0) {
        await tx.delete(listsRelationships).where(eq(listsRelationships.childListId, listId.listIds));
        await tx.delete(items).where(eq(items.listsId, listId.listIds));
        await tx.delete(lists).where(eq(lists.id, Number(listId.listIds)));
      }
    }
    // Delete the user from users table
    await tx.delete(users).where(eq(users.id, user.id));
  });
}

export async function signUpUser(authObj: UserSignup) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const data = authObj?.data;
  const accountId = data?.id;
  const email = data?.external_accounts?.[0]?.email_address;
  const firstName = data?.external_accounts?.[0]?.first_name;

  if (!accountId || !email || !firstName) {
    return;
  }

  type NewUser = typeof users.$inferInsert;
  const newUser: NewUser = {
    clerkId: accountId,
    email: email,
    username: firstName,
  };
  await db.insert(users).values(newUser);
}

async function getDBUserId(authId: string) {
  const fullUser = await clerkClient.users.getUser(authId);

  if (!fullUser.emailAddresses[0]?.emailAddress)
    throw new Error("Couldn't find user in database");
  // Somehow get userid == 1 e.g.
  //

  return await db.query.users.findFirst({
    where: (model, { eq }) =>
      eq(model.email || "", fullUser.emailAddresses[0]!.emailAddress),
  });
}

export async function createList({
  name,
  type,
}: {
  name: string;
  type: ListStatus;
}) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const userDbObj = await getDBUserId(user.userId);

  // Do not throw, but handle maybe deleted user?
  if (!userDbObj?.id) {
    // throw new Error("No user id gotten from mail");
    return [];
  }
  type NewList = typeof lists.$inferInsert;
  const newList: NewList = {
    name: name,
    type: type,
  };


  const some = await db.transaction(async (tx) => {
    const list = await tx.insert(lists).values(newList).returning();
    if(!list?.[0]) return;
    const resultListsUsers = await tx.insert(listsUsers)
      .values({listsId: list[0].id, usersId: userDbObj.id})
      .returning();

    return {
      listId: list[0].id,
      name: newList.name,
      listType: newList.type,
      ids: resultListsUsers[0]?.usersId,
      avatars: [{clerkId: user.userId}],
    }
  })

  return some;
}


export async function deleteList(listId: number){
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const userDbObj = await getDBUserId(user.userId);

  // Do not throw, but handle maybe deleted user?
  if (!userDbObj?.id) {
    // throw new Error("No user id gotten from mail");
    return [];
  }
    

  const userAuthId = userDbObj.clerkId;

  // Start a transaction
   return await db.transaction(async (tx) => {
    // Get db userid
    const dbUsers = await tx
      .select()
      .from(users)
      .where(eq(users.clerkId, userAuthId));

    // user from db.
    const user = dbUsers?.at(0);

    // If user not found, return. Something went wrong
    if (!user) {
      return;
    }

    
    // Handle trying to delete parent first ? 
      // Throw that child list must be deleted first.
    
    // console.log("Deleting list USers")
    // await tx
    // .delete(listsUsers)
    // .where(eq(listsUsers.listsId, listId));
    // Delete entries from lists_users where usersId matches the userId
    const deletedList = await tx
    .delete(lists)
    .where(eq(lists.id, listId))
    .returning();

    await tx.delete(items)
        .where(eq(items.listsId, listId))
        .returning()
    
    return deletedList; 
  });
}

export async function getMyLists() {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const fullUser = await clerkClient.users.getUser(user.userId);

  if (!fullUser.emailAddresses[0]?.emailAddress)
    throw new Error("Couldn't find user in database");
  // Somehow get userid == 1 e.g.
  //

  const userDbObj = await db.query.users.findFirst({
    where: (model, { eq }) =>
      eq(model.email || "", fullUser.emailAddresses[0]!.emailAddress),
  });

  // Do not throw, but handle maybe deleted user?
  if (!userDbObj?.id) {
    // throw new Error("No user id gotten from mail");
    return [];
  }

  // Get lists that user is part of.
  const userLists = await db
    .select({
      listId: lists.id,
      listName: lists.name,
      listType: lists.type,
    })
    .from(lists)
    .innerJoin(listsUsers, eq(listsUsers.listsId, lists.id))
    .where(eq(listsUsers.usersId, userDbObj.id));

  // If no list, return empty
  if (userLists.length === 0) {
    return []; // No lists found for the user
  }

  // Get all ids of lists, to later get other users also in lists
  const listIds = userLists.map((userList) => userList.listId);

  // Get related users and list names.
  const relatedUsers = await db
    .select({
      name: lists.name,
      ids: sql`array_agg(${users.clerkId})`,
      listId: lists.id,
      listType: lists.type,
    })
    .from(users)
    .innerJoin(listsUsers, eq(listsUsers.usersId, users.id))
    .innerJoin(lists, eq(listsUsers.listsId, lists.id))
    .where(sql`${listsUsers.listsId} in ${listIds}`)
    .groupBy((t) => [t.name, t.listId, t.listType]); 

  // Perform type assertion for userEmail
  const typedRelatedUsers: RelatedUser[] = relatedUsers.map((user) => ({
    name: user.name,
    ids: user.ids as string[],
    listId: user.listId,
    listType: user.listType
  }));

  return typedRelatedUsers;
}
