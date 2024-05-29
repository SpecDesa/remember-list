'use client';
import CreateList from "./create-list";
import { useSearchParams, useRouter } from "next/navigation";
export enum ListAction {
    Create = 'create',
    View = 'view',
    Buy = 'buy'

} 

export default  function ListPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const action = searchParams.get('action') as ListAction;
    
    if(!action || action === null){
        return router.back();
    }

    if(!Object.values(ListAction).includes(action)){
        return router.back();
    }

    return (<div>
        {action === ListAction.Create &&
        <CreateList />
        }
        {action !== ListAction.Create &&
        <div>123</div>
        }
    </div>)
}
