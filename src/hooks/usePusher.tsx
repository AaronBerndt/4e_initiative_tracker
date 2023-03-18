import { useEffect } from "react";
import { usePusherContext } from "../context/PusherContext";
import { useCombat } from "./useCombat";

export default function usePusher(_id: string) {
  const { refetch } = useCombat(_id);

  const { channel } = usePusherContext();

  useEffect(() => {
    if (_id !== undefined || _id !== "") {
      channel.bind(`Combat ${_id} has been updated`, (data: any) => {
        refetch();
      });
    }
  }, [channel, _id, refetch]);
}
