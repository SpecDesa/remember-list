'use client'

interface ListeProps {
    listId: number;
    action: "view" | 'edit' | 'shopping';
}

const Liste: React.FC<ListeProps> = ({listId, action}) => {

    console.log(listId, action)

    

    return <div></div>
}



export default Liste;