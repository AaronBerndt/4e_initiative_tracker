import axios from "axios";
import { useQuery } from "react-query";
import { addTokens, removeTokens } from "../utils/OBRHelperFunctions";

export const FETCH_COMBAT_KEY = "Fetch Combat";

export function useCombat(combatId?: any) {
  return useQuery<any>(
    [FETCH_COMBAT_KEY, combatId],
    () => axios.get(`https://4e-pwa.vercel.app/api/combats?_id=${combatId}`),
    {
      select: ({ data }) => data,
      onSuccess: async (data) => {
        removeTokens(data.combatants.filter((combatant: any) => combatant));
        addTokens(data.combatants.filter((combatant: any) => combatant));
      },
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
}
