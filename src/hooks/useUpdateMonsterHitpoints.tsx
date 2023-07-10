import axios from "axios";
import { find } from "lodash";
import { useMutation, useQueryClient } from "react-query";
import { FETCH_COMBAT_KEY } from "./useCombat";
type MutateProps = {
  _id: string;
  healthChangeAmount: number;
  type: "heal" | "damage" | "add temporary hitpoints";
  hitpoints: number;
  combatId: string;
};

export default function useUpdateMonsterHitpoints() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ healthChangeAmount, type, _id, hitpoints, combatId }) =>
      axios.post("https://4e-pwa.vercel.app/api/updateMonsterHitpoints", {
        data: { healthChangeAmount, _id, type, hitpoints, combatId },
      }),
    {
      onMutate: async ({
        healthChangeAmount,
        type,
        _id,
        hitpoints,
        combatId,
      }: MutateProps) => {
        const COMBAT_QUERY_KEY = [FETCH_COMBAT_KEY, combatId];

        await queryClient.cancelQueries(COMBAT_QUERY_KEY);

        const previousCombatState: any =
          queryClient.getQueryData(COMBAT_QUERY_KEY);

        let { combatants, ...rest } = previousCombatState.data;

        combatants = combatants.filter((combatant: any) => combatant);

        console.log(combatants);
        const combatant: any = find(combatants, { _id });
        console.log(combatant);

        const {
          monsterState: {
            damage,
            temporaryHitpoints,
            expendedSurges,
            secondWind,
            ...monsterStateRest
          },
          ...monsterRest
        } = combatant;

        const newMonsterState = {
          ...monsterRest,
          monsterState: {
            damage:
              type !== "add temporary hitpoints"
                ? ["heal"].includes(type)
                  ? Math.sign(hitpoints - damage) === -1
                    ? Math.sign(hitpoints - healthChangeAmount)
                      ? 0
                      : hitpoints - healthChangeAmount
                    : damage - healthChangeAmount <= 0
                    ? 0
                    : damage - healthChangeAmount
                  : damage +
                    (healthChangeAmount - temporaryHitpoints <= 0
                      ? 0
                      : healthChangeAmount - temporaryHitpoints)
                : damage,
            temporaryHitpoints:
              type === "add temporary hitpoints"
                ? healthChangeAmount > temporaryHitpoints
                  ? healthChangeAmount
                  : temporaryHitpoints
                : type === "damage"
                ? temporaryHitpoints - healthChangeAmount <= 0
                  ? 0
                  : temporaryHitpoints - healthChangeAmount
                : temporaryHitpoints,
            ...monsterStateRest,
          },
        };

        queryClient.setQueryData(COMBAT_QUERY_KEY, {
          data: {
            ...rest,
            combatants: combatants.map((combatant: any) =>
              combatant._id === _id ? newMonsterState : combatant
            ),
          },
        });

        return {
          COMBAT_QUERY_KEY,
        };
      },

      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries(context?.COMBAT_QUERY_KEY);
      },
    }
  );
}
