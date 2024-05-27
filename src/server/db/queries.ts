import 'server-only'
import { db } from '.'
import { auth, clerkClient } from '@clerk/nextjs/server';
import { lists, listsUsers, users } from './schema';
import { eq, sql } from 'drizzle-orm/sql';
import { ClerkUser } from '~/types/clerk/clerk-user';

export async function getTasks() {

    const items = await db.query.items.findMany({
        orderBy: (model, {desc}) => desc(model.id),  // Make newest come first. maybe lowest quantity first.  
      });

    return items;
}


export async function signUpUser(authObj: ClerkUser){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const data = authObj?.data
    const accountId = data?.external_accounts?.[0]?.id;
    const email = data?.external_accounts?.[0]?.email_address;
    const firstName = data?.external_accounts?.[0]?.first_name;
    
    if(!accountId || !email || !firstName){
        console.log("Something missing, return udnefined")
        return
    }

    type NewUser = typeof users.$inferInsert;

    console.log("Creating new user")
    const newUser: NewUser = { clerkId: accountId, email: email, username: firstName};
    console.log("User::", newUser)
    const response = await db.insert(users).values(newUser);
    console.log("Inserted?", response)
}


export async function getMyLists() {
    const user = auth();

    if(!user.userId ) throw new Error("Unauthorized");

    const fullUser = await clerkClient.users.getUser(user.userId);


    if(!fullUser.emailAddresses[0]?.emailAddress) throw new Error("Couldn't find user in database");
    // Somehow get userid == 1 e.g.
    //

    const userDbObj = await db.query.users.findFirst({
        where: (model, {eq}) => eq(model.email || '', fullUser.emailAddresses[0]!.emailAddress ) 
    })

    // Do not throw, but handle maybe deleted user?
    if(!userDbObj?.id) {
        // throw new Error("No user id gotten from mail");
        return []
    }


    // Get lists that user is part of.
    const userLists = await db.select({
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
    const listIds = userLists.map(userList => userList.listId);


    // Define an interface for the result type
    interface RelatedUser {
        name: string;
        ids: string[]; // Define type for userEmail as string array
    }

    // Get related users and list names.
    const relatedUsers = await db.select({
        name: lists.name,
        ids: sql`array_agg(${users.clerkId})`    
        
    })
    .from(users)
    .innerJoin(listsUsers, eq(listsUsers.usersId, users.id))
    .innerJoin(lists, eq(listsUsers.listsId, lists.id))
    .where(sql`${listsUsers.listsId} in ${listIds}`)
    .groupBy((t) => [t.name]); // Group by both list ID and list name
    
    // Perform type assertion for userEmail
    const typedRelatedUsers: RelatedUser[] = relatedUsers.map((user) => ({
        name: user.name!,
        ids: user.ids as string[]
    }));

    return typedRelatedUsers 

}
