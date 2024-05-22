import 'server-only'
import { db } from '.'
import { auth } from '@clerk/nextjs/server';

export async function getImages(){
    const images = await db.query.images.findMany({
        orderBy: (model, {desc}) => desc(model.id)
    })

    return images;
}


export async function getTasks() {

    const items = await db.query.items.findMany({
        orderBy: (model, {desc}) => desc(model.id),  // Make newest come first. maybe lowest quantity first.  
      });

    return items;
}


export async function getMyLists() {
    const user = auth();

    if(!user.userId ) throw new Error("Unauthorized");

    // const lists = await db.query.userLists.findMany({
    //     where: (model, {eq}) => eq(model.userId, user.userId),
    // })
     
    const items = await db.query.lists.findMany({
        where:(model, {eq}) => eq(model.userId, user.userId),
        // orderBy: (model, {desc}) => desc(model.id),  // Make newest come first. maybe lowest quantity first.  
      });

    return items;
}
