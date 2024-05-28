import { Skeleton } from "~/components/ui/skeleton" 

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3 justify-center self-center items-center">
      <Skeleton className="h-36 w-36  md:h-96 md:w-96 rounded-xl" />
    </div>
  )
  // return <div className="flex justify-center text-center ">Loading</div> 
}
