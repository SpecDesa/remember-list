import 'server-only'
import { db } from '.'
import { auth, clerkClient } from '@clerk/nextjs/server';
import { lists, listsUsers, users, usersLists } from './schema';
import { eq } from 'drizzle-orm/sql';

export async function getTasks() {

    const items = await db.query.items.findMany({
        orderBy: (model, {desc}) => desc(model.id),  // Make newest come first. maybe lowest quantity first.  
      });

    return items;
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

    if(!userDbObj?.id) throw new Error("No user id gotten from mail");

    const result = await db.select({lists: lists}).from(lists)
        .innerJoin(listsUsers, eq(listsUsers.listsId, lists.id ))
        .innerJoin(users, eq(listsUsers.usersId, users.id))
        .where(eq(users.id, userDbObj?.id))

    console.log("result", result) 
    return result
     
//     const items = await db.query.lists.findMany({
//         where:(model, {eq}) => eq(model.userId, user.userId),
//         // orderBy: (model, {desc}) => desc(model.id),  // Make newest come first. maybe lowest quantity first.  
//       });
// 
//     return items;
}
