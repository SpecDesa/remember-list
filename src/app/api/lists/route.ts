import { createList } from "~/server/db/queries";
import { type ListStatus } from "~/server/db/types";


export async function POST(req: Request) {  
    const listObj = await req.json() as unknown as {name: string, type: ListStatus}
    await createList(listObj)
   
    return Response.json({msg: "Created"})
  }