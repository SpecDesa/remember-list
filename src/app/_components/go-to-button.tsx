'use client'
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function GoToButton({url, text}: {text:string, url: string}){
    const router = useRouter();

    return (
        <Button className="mt-4" onClick={() => router.push(url)}>{text}</Button>
      
    )
}