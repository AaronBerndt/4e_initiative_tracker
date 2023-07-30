import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

type MutateProps = {
  damagerId: string;
  targets: string[];
  damageSource: string;
  damageFormula: string;
  combatId: string;
  damageRollOverride?: number;
};

export default function useTargetWithDamage() {
  return useMutation((mutateProps: MutateProps) =>
    axios.post("/api/targetWithDamage", {
      data: mutateProps,
    })
  );
}
