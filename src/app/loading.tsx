import { Skeleton } from "~/components/ui/skeleton" 


interface LoadingInterface {
  skeletonHeight?: string
  skeletonWidth?: string
  mdSkeletonHeight?: string
  mdSkeletonWidth?: string
}

export default function Loading({skeletonHeight, skeletonWidth, mdSkeletonHeight, mdSkeletonWidth}: LoadingInterface) {
  return (
    <div className="flex flex-col space-y-3 justify-center self-center items-center">
      <Skeleton className={`${skeletonHeight ? skeletonHeight : 'h-36'} ${skeletonWidth ? skeletonWidth : 'w-36'} ${mdSkeletonHeight ? mdSkeletonHeight : 'h-96'} ${mdSkeletonWidth ? mdSkeletonWidth : 'w-96'} rounded-xl`} />
    </div>
  )
  // return <div className="flex justify-center text-center ">Loading</div> 
}
