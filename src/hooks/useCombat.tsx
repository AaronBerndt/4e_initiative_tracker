import axios from "axios";
import { useQuery } from "react-query";

export const FETCH_COMBAT_KEY = "Fetch Combat";

export function useCombat(combatId?: any) {
  return useQuery<any>(
    [FETCH_COMBAT_KEY, combatId],
    () => axios.get(`https://4e-pwa.vercel.app/api/combats?_id=${combatId}`),
    {
      select: ({ data }) => data,
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
}
