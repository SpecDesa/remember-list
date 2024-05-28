'use client';
import CreateList from "./create-list";
import { useSearchParams, useRouter } from "next/navigation";
enum Action {
    Create = 'create',
    View = 'view'

} 

export default  function ListPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const action = searchParams.get('action') as Action;
    
    console.log("action", action, action === Action.Create)
    if(!action || action === null){
        return router.back();
    }

    if(!Object.values(Action).includes(action)){
        return router.back();
    }

    return (<div>
        {action === Action.Create &&
        <CreateList />
        }
        {action !== Action.Create &&
        <div>123</div>
        }
    </div>)
}
