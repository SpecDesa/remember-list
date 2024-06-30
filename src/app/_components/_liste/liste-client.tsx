"use client";
import { ListAction } from "~/app/(lister)/lister/page";
import ListeClientBuy from "./liste-client-buy";
import ListeClientView from "./liste-client-view";

interface ListeClientProps {
  action: ListAction;
}
const ListeClient: React.FC<ListeClientProps> = ({ action }) => {
  const logicRenderingView = (action: string) => {
    if (action === ListAction.View.valueOf()) {
      return <ListeClientView />;
    } else if (action === ListAction.Buy.valueOf()) {
      return <ListeClientBuy />;
    } else {
      return;
    }
  };

  return logicRenderingView(action);
};

export default ListeClient;
