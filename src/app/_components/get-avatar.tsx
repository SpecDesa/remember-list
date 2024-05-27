
import { clerkClient } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export default async function GetAvatar({ clerkId }: { clerkId: string }) {
  console.log("que", clerkId)
  try {
    const user = await clerkClient.users.getUser(clerkId);
    
  } catch (error) {
      console.log("ERr", error)
  }
  const user = await clerkClient.users.getUser(clerkId);

  const firstname = user.firstName?.toLocaleUpperCase() ?? "";
  const lastname = user.lastName?.toLocaleUpperCase() ?? "";
  const initials =
    (firstname ? firstname.charAt(0) : "") +
    (lastname ? lastname.charAt(0) : "");

  return (
    <Avatar key={clerkId} className="">
      <AvatarImage src={user.imageUrl || ""} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
