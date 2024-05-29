import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
export default function GetAvatar({ clerkId, imageUrl, initials }: { clerkId: string, imageUrl: string, initials: string }) {
  return (
    <Avatar key={clerkId} className="">
      <AvatarImage src={imageUrl || ""} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
