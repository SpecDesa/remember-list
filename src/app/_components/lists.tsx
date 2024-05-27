import { ScrollArea } from "~/components/ui/scroll-area";
import { getMyLists } from "~/server/db/queries";
import { Button } from "~/components/ui/button";
import GetAvatar from "./get-avatar";

export const dynamic = "force-dynamic";

export default async function Lists() {
  const lists = await getMyLists();

  return (
    <div className="h-[80vh] flex-row">
      <h2 className="mb-2 ms-8 mt-2 flex text-2xl">Dine Lister</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <ScrollArea className="h-[380px] w-5/6 gap-4 rounded-md md:h-[600px] md:w-2/3">
          <div className="flex flex-col gap-1 p-4">
            {lists.map((list, idx) => (
              <div
                key={idx + "_outer"}
                className="shadow-3xl mb-4 transform 
                            bg-white transition-all duration-300 
                            hover:translate-y-1 hover:cursor-pointer md:hover:bg-gray-300"
              >
                <div
                  className="mx-2 flex 
                            justify-between text-center text-sm text-black"
                >
                  <div className="">{list.name}</div>
                  <div className=" ">1/1</div>
                  <div className=" ">...</div>
                </div>
                <div className="mx-2 flex items-center space-x-[-20px]">
                  {list.ids?.map(async (id, idx) => {
                    return <GetAvatar key={`${idx}_${id}`} clerkId={id} />;
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className=" flex flex-wrap justify-center gap-4">
        <Button className="mt-4">Tilføj ny liste</Button>
      </div>
    </div>
  );
}
