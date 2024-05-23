
import { ScrollArea } from "~/components/ui/scroll-area";
import { getMyLists, getTasks } from "~/server/db/queries";
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic"



async function GetAvatar(){
    return (
            <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
            </Avatar>
           )
}

export default async function Lists() {
    const lists = await getMyLists();
    // await db.query.items.findMany({
    //   orderBy: (model, {desc}) => desc(model.id),  // Make newest come first. maybe lowest quantity first.  
    // });
    // const mockImages = mockUrls.map((url, index) => ({
    //   id: index + 1,
    //   url,
    // }));

    console.log("listststs", lists)
    
    const tags = Array.from({ length: 10}).map(
            (_, i, a) => `Indkøbsliste-${a.length - i}`
            )
        return (
                <div className="flex-row h-[80vh]">
                <h2 className="flex ms-8 mt-2 mb-2 text-2xl">Lister</h2>
                <div className="flex flex-wrap justify-center gap-4">
                <ScrollArea className="h-[480px] md:h-[700px] md:w-2/3 w-5/6 rounded-md gap-4">
                <div className="p-4 flex flex-col gap-1">
                {tags.map((tag) => (
                            <div key={tag} className="bg-white mb-4 shadow-3xl 
                            transform hover:translate-y-1 transition-all 
                            duration-300 md:hover:bg-gray-300 hover:cursor-pointer">
                            <div key={tag} className="flex justify-between 
                            text-black text-sm text-center">
                            <div className="">
                            {tag}
                            </div>
                            <div className=" ">1/1</div>
                            <div className=" ">...</div>
                            </div>
                            <div>
                            <GetAvatar />
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

