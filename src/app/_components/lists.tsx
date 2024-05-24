
import { ScrollArea } from "~/components/ui/scroll-area";
import { getMyLists, getTasks } from "~/server/db/queries";
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from "~/components/ui/button";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic"



async function GetAvatar({clerkId}: {clerkId: string}){
   const user = await clerkClient.users.getUser(clerkId)

   const firstname = user.firstName?.toLocaleUpperCase() ?? ''; 
   const lastname = user.lastName?.toLocaleUpperCase() ?? ''; 
    const initials = (firstname ? firstname.charAt(0) : '') + (lastname ? lastname.charAt(0) : '');

    return (

            <Avatar key={clerkId} className="">
            <AvatarImage src={user.imageUrl || '' } />
            <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
           )
}

export default async function Lists() {
    const lists = await getMyLists();

    return (
                <div className="flex-row h-[80vh]">
                <h2 className="flex ms-8 mt-2 mb-2 text-2xl">Lister</h2>
                <div className="flex flex-wrap justify-center gap-4">
                <ScrollArea className="h-[480px] md:h-[700px] md:w-2/3 w-5/6 rounded-md gap-4">
                <div className="p-4 flex flex-col gap-1">
                {lists.map((list, idx) => (
                            <div key={idx + '_outer'} className="bg-white mb-4 shadow-3xl 
                            transform hover:translate-y-1 transition-all 
                            duration-300 md:hover:bg-gray-300 hover:cursor-pointer">
                            <div className="flex justify-between 
                            text-black text-sm text-center mx-2">
                            <div className="">
                            {list.name}
                            </div>
                            <div className=" ">1/1</div>
                            <div className=" ">...</div>
                            </div>
                            <div className="flex items-center mx-2 space-x-[-20px]">
                                {list.ids?.map(async (id, idx) => {
                                        return <GetAvatar key={`${idx}_${id}`} clerkId={id}/>
                                    })}

                            </div>
                            </div>
                            ))}
    </div>
        </ScrollArea>
        </div>
        <div className=" flex flex-wrap justify-center gap-4">
        <Button className="mt-4" >
        Tilføj ny liste</Button>
        </div>
        </div>
        )
}

