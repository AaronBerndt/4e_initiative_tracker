import axios from "axios";
import { useMutation } from "react-query";

type MutateProps = {
  attackerId: string;
  targets: string[];
  attackName: string;
  attackFormula: string;
  combatId: string;
  attackRollOverride?: number;
};

export default function useTargetWithAttack() {
  return useMutation(
    (mutateProps: MutateProps) =>
      axios.post("/api/targetWithAttack", {
        data: mutateProps,
      }),
    {}
  );
}
