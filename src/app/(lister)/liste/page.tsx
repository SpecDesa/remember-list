'use client';
import ListeClient from "~/app/_components/_liste/liste-client";
import { useSearchParams } from "next/navigation";
import { ListAction } from "../lister/page";
export const dynamic = "force-dynamic"

export default function Liste() {
    const searchParams = useSearchParams();
    const action = searchParams.get("action") as ListAction;
    
    if(!Object.values(ListAction).includes(action)){
        console.error("ListAction is not valid")
    }
    
    return (
        <ListeClient action={action} />
    );
}
